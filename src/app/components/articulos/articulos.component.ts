import { Component, OnInit } from '@angular/core';
import { Articulos, Articulo}from '../../articulo';
import {MockArticulosService} from '../../mock-articulos.service';
import { ArticuloFamilia}from '../../articulo-familia';
import {MockArticulosFamiliasService} from '../../mock-articulos-familias.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {
  Titulo = "Articulos";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

 Lista: Articulo[] = [];
  RegistrosTotal: number;
  Familias: ArticuloFamilia[] = [];
  SinBusquedasRealizadas = true;
  Pagina = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: "" },
    { Id: true, Nombre: "SI" },
    { Id: false, Nombre: "NO" }
  ];


  constructor(
    public formBuilder: FormBuilder,
    private articulosService: MockArticulosService,
    private articulosFamiliasService: MockArticulosFamiliasService,
  ) {}

  FormFiltro: FormGroup;
  FormReg: FormGroup;

  ngOnInit() {
    this.FormFiltro = this.formBuilder.group({
      Nombre: [null],
      Activo: [null]
    });
    this.FormReg = this.formBuilder.group({
      IdArticulo: [null],
      Nombre: [null],
      Precio: [null],
      Stock: [null],
      CodigoDeBarra: [null],
      IdArticuloFamilia: [null],
      FechaAlta: [null],
      Activo: [false]
    });

    this.GetFamiliasArticulos();
  }

  GetFamiliasArticulos() {
         this.articulosFamiliasService.get().subscribe((res: ArticuloFamilia[]) => {
       this.Familias = res;
     });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset({Activo: true});
  }

  // Buscar segun los filtros, establecidos en FormReg
  Buscar() {
     this.articulosService
      .get(this.FormFiltro.value.Nombre, this.FormFiltro.value.Activo, this.Pagina)
      .subscribe((res: any) => {
        this.Lista = res.Lista;
        this.RegistrosTotal = res.RegistrosTotal;
      });
     this.SinBusquedasRealizadas = false;
  }

  // Obtengo un registro especifico según el Id
  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll
        this.articulosService.getById(Dto.IdArticulo).subscribe((res: any) => {
  
      const itemCopy = { ...res };  // hacemos copia para no modificar el array original del mock
      
      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("-");
      itemCopy.FechaAlta = arrFecha[2] + "/" + arrFecha[1] + "/" + arrFecha[0];

      this.FormReg.patchValue(itemCopy);
      this.AccionABMC = AccionABMC;
    });

  }

  Consultar(Dto) {
    this.BuscarPorId(Dto, "C");
  }

  // comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(Dto) {
    if (!Dto.Activo) {
      alert("No puede modificarse un registro Inactivo.");
      return;
    }
    this.BuscarPorId(Dto, "M");
  }

  // grabar tanto altas como modificaciones
  Grabar() {
   
    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };
 
    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = 
          new Date(
            arrFecha[2],
            arrFecha[1] - 1,
            arrFecha[0]
          ).toISOString();
 
    // agregar post
    if (itemCopy.IdArticulo == 0 || itemCopy.IdArticulo == null) {
      itemCopy.IdArticulo = 0 ;  // EntityFramework mapea la propiedad no nuleable
      this.articulosService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.articulosService
        .put(itemCopy.IdArticulo, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          alert('Registro modificado correctamente.');
          this.Buscar();
        });
    }
  }

  ActivarDesactivar(Dto) {
    var resp = confirm(
      "Esta seguro de " +
        (Dto.Activo ? "desactivar" : "activar") +
        " este registro?");
    if (resp === true)
          {
     this.articulosService.delete(Dto.IdArticulo).subscribe((res: any) => this.Buscar());
          }
  }

    //filtrar el array Familias y a partir de un IdArticuloFamilia recuperar el Nombre de la misma.
    GetArticuloFamiliaNombre(Id){
    var ArticuloFamilia = this.Familias.filter(x => x.IdArticuloFamilia === Id)[0];
    if (ArticuloFamilia)
        return ArticuloFamilia.Nombre;
    else
      return "";
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  ImprimirListado() {
    alert('Sin desarrollar...');
  }

}
