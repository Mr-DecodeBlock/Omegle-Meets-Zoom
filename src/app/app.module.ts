import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ZoomComponent } from './zoom/zoom.component';
import { OmegleComponent } from './omegle/omegle.component';
import {RouterModule} from "@angular/router";
import { ErrorPageComponent } from './error-page/error-page.component';
import {RoutingModule} from "./routing.module";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ZoomComponent,
    OmegleComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    RouterModule,
    RoutingModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
