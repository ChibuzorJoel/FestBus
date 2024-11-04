import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { RouteComponent } from './pages/route/route.component';
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './pages/report/report.component';
import { BusInfoComponent } from './pages/bus-info/bus-info.component';
import { ContactComponent } from './pages/contact/contact.component';

const appRoute: Routes = [

  {path:'',component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'search', component:SearchComponent},
  {path: 'route', component:RouteComponent},
  {path: 'report', component:ReportComponent},
  {path: 'bus-info', component:BusInfoComponent},
  {path: 'contact', component:ContactComponent}
  
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(appRoute)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
