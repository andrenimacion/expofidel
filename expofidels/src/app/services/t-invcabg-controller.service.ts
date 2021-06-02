import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TInvcabgControllerService {

  private apiURL = 'https://alp-cloud.com:8453/api';

  constructor( private http: HttpClient ) { }
  
  // Guardamos la cabecera de lo despachado
  despachoSaveCab = ( content ) => this.http.post(this.apiURL + '/despachos_control_cab/save_despacho_cab', content);
  
  // Guardamos el detalle de lo despachado
  despachoSaveDet = ( content ) => this.http.post(this.apiURL + '/despachos_control_det/save_despacho_det', content);
  

  //procedimientos almacenados
  getExec = (token, pk2) => this.http.get( this.apiURL + '/despachos_control_cab/getExec/'+token + '/' + pk2 );
  getExecReport = (type, number) => this.http.get( this.apiURL + '/despachos_control_cab/getExecReport/'+type + '/' + number );
  
}
