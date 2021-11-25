import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  collections = []
  cache:any;

  get(key:string) {
    return this.cache[key]
  }
  set(key:string,val:any) {
    console.log("Object " + key + " saved in memory");
    this.cache[key] = val;
  }

  constructor() { }

}

