import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoControlEmpService {

  private apiURL = 'https://alp-cloud.com:8453/api';
  constructor( private http: HttpClient ) { }

  getTypes = () => this.http.get( this.apiURL + '/tcontrolemp/getTipoControlEmp');
  putTypes = (id, model) => this.http.put( this.apiURL + '/tcontrolemp/putTipoControlEmp/' + id, model )

}
