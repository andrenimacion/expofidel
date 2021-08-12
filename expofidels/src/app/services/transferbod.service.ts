import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TransferbodService {

  private urlapi = 'https://alp-cloud.com:8453/api/';
  
  constructor( private http: HttpClient ) { }
  getBodegas = ( filter )       => this.http.get( this.urlapi + 'transferbode/getBodegas/' + filter );
  getProdBod = ( bodega, date ) => this.http.get( this.urlapi + 'transferbode/getBodegasProducts/' + bodega + '/' + date );
  saveProdBod    = (model)     => this.http.post( this.urlapi + 'transferbode/save_transfer/', model );
  updateProdBod  = (id, model) => this.http.put( this.urlapi  + 'transferbode/puttransprod/' + id, model );
  delProdBod     = (id) => this.http.get( this.urlapi + 'transferbode/deltransprod/' + id );
  genProdBod     = ()   => this.http.get( this.urlapi + 'transferbode/gettransprod');
  getTransacProd = () => this.http.get( this.urlapi + 'transferbode/getTransacProd');
  //========================== SAVE CABECERA y DETALLE INICIO =========================
  saveCab = (model) => this.http.post( this.urlapi + 'transferbode/save_transfer_cab', model );
  saveDet = (model) => this.http.post( this.urlapi + 'transferbode/save_transfer_det', model );
  //==================================== FIN ==========================================
  //============================ EXEC COMPROBANTE INICIO ==========================================
  exec    = ( key, tempo ) => this.http.get( this.urlapi + 'transferbode/getCodectransfer/' + key + '/' + tempo);
  //============================== EXEC COMPROBANTE FIN ===========================================
  getGraphicGen = () => this.http.get( this.urlapi + 'transferbode/getGrafic' );

}
