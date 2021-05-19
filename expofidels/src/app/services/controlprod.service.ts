import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlprodService {

  private urlapi = 'https://alp-cloud.com:8453/api/';

  constructor( private http: HttpClient ) { }  

  //obtiens los tipos las facturas por parámetros
  getfactura  = (a,b,c,d) => this.http.get( this.urlapi + `controlprod/getFACTS/${a}/${b}/${c}/${d}`);
  
  //obtiens los tipos de facturas existentes
  getfacttype = (type, top) => this.http.get( this.urlapi + `controlprod/getFactsType/${type}/${top}`);


}