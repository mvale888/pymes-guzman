import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';  


import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ArticulosFamiliasComponent } from './components/articulos-familias/articulos-familias.component';
import { MenuComponent } from './components/menu/menu.component';
import { MockArticulosFamiliasService } from './mock-articulos-familias.service';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { MockArticulosService } from './mock-articulos.service';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports:      [
   BrowserModule,
   FormsModule,
   RouterModule.forRoot([
      { path: '', redirectTo: '/inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'articulosfamilias', component: ArticulosFamiliasComponent },
      { path: 'articulos', component: ArticulosComponent },
       ]),
    ReactiveFormsModule
    ],
  declarations: [ AppComponent, HelloComponent, InicioComponent, ArticulosFamiliasComponent, MenuComponent, ArticulosComponent ],
  bootstrap:    [ AppComponent ],
  providers: [MockArticulosFamiliasService, { provide: APP_BASE_HREF, useValue: "/"}, MockArticulosService ]
})
export class AppModule { }
