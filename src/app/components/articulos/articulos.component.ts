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
    this.AccionABMC = AccionABMC;
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
    alert("Registro Grabado!");
    this.Volver();
  }

  ActivarDesactivar(Dto) {
    var resp = confirm(
      "Esta seguro de " +
        (Dto.Activo ? "desactivar" : "activar") +
        " este registro?");
    if (resp === true)
      alert("registro activado/desactivado!");
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  ImprimirListado() {
    alert('Sin desarrollar...');
  }

}
