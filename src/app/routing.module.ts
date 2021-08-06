import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {ZoomComponent} from "./zoom/zoom.component";
import {OmegleComponent} from "./omegle/omegle.component";
import {ErrorPageComponent} from "./error-page/error-page.component";


const routes : Routes = [
  {
    path : '', pathMatch : 'full' , component : HomeComponent
  },

  {
    path : 'home' , component : HomeComponent,
  },

  {
    path : 'zoom' , component : ZoomComponent,
  },

  {
    path : 'omegle' , component : OmegleComponent,
  },

  {
    path : 'error404' , component : ErrorPageComponent
  },

  {
    path : '**' , redirectTo : 'error404'
  }

]

@NgModule({
  imports : [
    RouterModule.forRoot(routes)
  ],
  exports : [
    RouterModule
  ]
})
export class RoutingModule {

}
