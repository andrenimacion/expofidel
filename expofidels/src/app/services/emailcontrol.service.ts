import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailcontrolService {

  private urlapi = 'https://alp-cloud.com:8453/api/';

  constructor( private http: HttpClient ) { }

    //obtiens los tipos las facturas por parámetros
    updtEmail  = (email) => this.http.get( this.urlapi + `api/webmail/UpdateMail/${email}`);

    getEmail = () => this.http.get( this.urlapi + `api/webmail/SelectMail`);


}
