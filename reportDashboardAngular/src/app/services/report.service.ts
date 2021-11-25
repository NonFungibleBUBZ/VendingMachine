import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  getCollections() {
    return this.http.get(`${this.url.getUrl()}/report/test`)
  }

  constructor(private http: HttpClient, private url: UrlService) { }

}
