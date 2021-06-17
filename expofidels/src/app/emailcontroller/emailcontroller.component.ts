import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DatecontrolService } from '../services/datecontrol.service';
import { EmailServicesService } from '../services/email-services.service';

import Swal from 'sweetalert2'

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { EmailcontrolService } from '../services/emailcontrol.service';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-emailcontroller',
  templateUrl: './emailcontroller.component.html',
  styleUrls: ['./emailcontroller.component.styl']
})
export class EmailcontrollerComponent implements OnInit {

  private arrMail: any = [];
  public  arrMessageDB: any = [];
  public _copyemail: string;

  constructor(public date: DatecontrolService,
              private eSend:EmailServicesService,
              private getMail: EmailcontrolService) { }
  public dateN = this.date.date();

  public _email:    string;
  public _asunto:   string;
  public _data:     boolean;
  public messageComplete: string;
  
  public arrMAILBD: any = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [
    {name: sessionStorage.getItem('Email-Principal')}
  ];

  ngOnInit() {
    this.getMailDBSQL();
    this._email = sessionStorage.getItem('Email-Principal');
  }

  getValueCheck(a) {  
    console.log(a);
    if( !a ) {
      this.messageComplete = "<span style='color: gray; font-size: 8pt;'>No se ha adherido el detalle al mensaje principal...</span>";
      return this.messageComplete;
    }

    else {
      this.messageComplete =  `<strong> Nombre cliente: </strong> ${localStorage.getItem('nomCliente')} <hr>`+
                              `<strong> Comprobante: </strong> ${localStorage.getItem('comprobante')} <hr>`+
                              `<strong> Bodega: </strong> ${localStorage.getItem('bodega')} <hr>` +
                              "<br><table style='width: 100%;'>" +
                                "<thead style='background-color: #444; color: white;'>" +
                                  "<th>Código</th>"     +
                                  "<th>Nombre</th>"     +
                                  "<th>Cantidad</th>"   +
                                  "<th>Escaneo</th>"    +
                                  "<th>Diferencia</th>" +
                                "</thead>"  +

                                "<tbody style='background-color: #FAC193;'>"   +
                                    "<tr>"  +
                                      `<th>${localStorage.getItem('p_codigo')}</th>`  +
                                      `<td>${localStorage.getItem('p_nombre')}</td>`  +
                                      `<td>${localStorage.getItem('p_cantidad')}</td>`+
                                      `<td>${localStorage.getItem('p_escaneo')}</td>` +
                                      `<td>${Number(localStorage.getItem('p_cantidad')) - Number(localStorage.getItem('p_escaneo'))}</td>`+
                                    "</tr>"+
                                "</tbody>" +

                              "</table>";
      
      return this.messageComplete;

    }
  }

  getMailDBSQL() {
    this.getMail.getEmail().subscribe( EMAIL => {
      this.arrMAILBD = EMAIL;
      console.log(this.arrMAILBD);

      //mail principal de la empresa, añadido a una variable de sessionStorage
      sessionStorage.setItem('Email-Principal', this.arrMAILBD[0].email_despacho_web);

    });
  }

  updateUniqueMail() {
    this.getMail.updtEmail(this.arrMAILBD).subscribe( UPDEMAIL => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se ha editado el correo principal, de envío de reportes de esta cuenta.',
        showConfirmButton: false,
        timer: 1500
      })
    }, (err) => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'No se ha editado el correo principal, debido a que tienes mala conexión',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if ( value ) {
      
      this.fruits.push(
        {
          name: value
        }
      );

      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        html: `Se ha añadido nuevo correo <strong>${value}</strong>`
      })

    }

    // console.log(this.fruits)
    // Clear the input value
    // event.input.c
  
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }

  }

  

  sendMailRecover(a,b,c,d) {  
      
      this.arrMail = {
        txtPara:      a,
        txtAsunto:    c,
        txtCopia:     b,
        txtMensaje:   d,
        MailAddress:  "syscompsasa@gmail.com",
        passwordMail: "sysgye2016",
        date_send_mail: new Date()
      }

      console.log(this.arrMail);
  
      this.eSend.SendMailJson(this.arrMail).subscribe( sendMail => {
          console.log(sendMail)
      }, (err) => {
          // alert('No se ha podido enviar el email, revisar bien los permisos');
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se envio el correo electrónico!',
            footer: 'Revisa tu conexión o la configuración de tu correo.'
          })
      })
  }
}
