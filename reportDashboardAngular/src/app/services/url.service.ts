import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  url = 'http://104.154.208.48:3000'

  getUrl() {
    return this.url
  }
  constructor() { }
}
