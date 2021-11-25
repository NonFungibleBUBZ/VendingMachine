import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { HeaderComponent } from './components/header/header.component';
import { DataPageComponent } from './pages/data-page/data-page.component';


@NgModule({
  declarations: [
    AppComponent,
    ReportPageComponent,
    ProjectCardComponent,
    HeaderComponent,
    DataPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
