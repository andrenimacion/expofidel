import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class ControlprodService {

  private urlapi = 'https://alp-cloud.com:8453/api/';

  constructor( private http: HttpClient, public iDB: IndexedDBService ) { }  

  //obtiens los tipos las facturas por parámetros
  //exec AR_controlprod
  getfactura  = (a,b,c,d) => this.http.get( this.urlapi + `controlprod/getFACTS/${a}/${b}/${c}/${d}`);
  
  //obtiens los tipos de facturas existentes
  getfacttype = (type, top) => this.http.get( this.urlapi + `controlprod/getFactsType/${type}/${top}`);
  
  //obtiens los tipos de facturas existentes
  //getfacttypegen = (type) => this.http.get( this.urlapi + `controlprod/getFactsGen/${type}`);

  createLibraryFacts(data) {
    console.log(data);
    this.iDB.createIndexedDB('facturas-type-DB', 1);
    this.iDB.saveDataIndexedDB('facturas-type-DB',1, data);    
  }

  getLotesProdDespacho(nparte) {
    return this.http.get( this.urlapi + `products/getLotesProdDespacho/${nparte}`);
  }

}