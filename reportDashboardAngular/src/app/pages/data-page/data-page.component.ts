import { Component, OnInit } from '@angular/core';
import {CacheService} from "../../services/cache.service";
import {Router} from "@angular/router";
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.css']
})
export class DataPageComponent implements OnInit {

  data:any

  constructor(private service: ReportService, public router: Router) { }

  ngOnInit(): void {
     this.service.getCollections().subscribe( (res:any)=> {
       this.data = res.data.find((collection:any) => {
         return collection.name = this.router.url.substring(1)
       })
       console.log(this.data)
    })

  }

}
