import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlloteService {

  private apiURL = 'https://alp-cloud.com:8453/api';
  constructor(private http: HttpClient) { }

    getLoteFilter(filter, nopart, top) {
      return this.http.get(this.apiURL + '/products/getLote/' + filter + '/' + nopart + '/' + top);
    }

    upimg( pk, content ) {
      return this.http.put( this.apiURL + '/img_lote/put_imge_lote/' + pk , content );
    }

    getimgbyNparte(nparte) {
      return this.http.get( this.apiURL + '/products/getLoteimg/' + nparte );
    }

    updateEstate(estadolote, tipo, numero) {
      return this.http.get( this.apiURL + '/products/estadoLote/' + estadolote + '/' + tipo + '/' + numero )
    }
    
    getloteFilterExec(filter,  opts) {
      return this.http.get( this.apiURL + '/products/getLoteFilter/' + filter + '/'  +  opts );
    }
    
    getloteFilterNProd(filter, noparte) {
      return this.http.get( this.apiURL + '/products/getLoteCodNpart/' + filter + '/' + noparte );
    }


}
