import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailServicesService {

  //private apiURL = 'http://localhost:5000/api';
  private apiURL = 'https://alp-cloud.com:8453/api';

  constructor( private http: HttpClient ) { }

  SendMail(txtPara,txtAsunto,txtCopia,txtMensaje,MailAddress,passwordMail) {

      return this.http.get( this.apiURL + '/UserLogin/mailMessage/'
                                        + txtPara         +     '/'
                                        + txtAsunto       +     '/'
                                        + txtCopia        +     '/'
                                        + txtMensaje      +     '/'
                                        + MailAddress     +     '/'
                                        + passwordMail );
  }

  SendMailJson(content) {
      return this.http.post( 'https://alp-cloud.com:8453/api/mailing/MailSendSave', content );
  }
  
}
