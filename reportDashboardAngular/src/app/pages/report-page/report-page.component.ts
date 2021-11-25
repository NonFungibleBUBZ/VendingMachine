import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";
import {CacheService} from "../../services/cache.service";

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {

  Projects = [{name:'firstCollection'}]

  constructor(private service: ReportService, private cache: CacheService) { }

  ngOnInit(): void {
    this.service.getCollections().subscribe( (res:any)=> {
      this.Projects = res
      this.cache.set('projects', res)
    })
  }



}
