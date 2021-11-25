import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportPageComponent } from "./pages/report-page/report-page.component";
import {DataPageComponent} from "./pages/data-page/data-page.component";

const routes: Routes = [
  { path: 'report', component: ReportPageComponent },
  { path: '',   redirectTo: '/report', pathMatch: 'full' },
  {
  path: ':projectName', component: DataPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
