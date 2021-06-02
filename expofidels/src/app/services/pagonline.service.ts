import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagonlineService {

  constructor() { }

  pOnline(objectID) {

    let typeAlert: string;
    let textAlertTittle: string; 
    let textAlertParagraph: string; 
    const a = document.getElementById(objectID);
    
    
    if(navigator.onLine) {
      typeAlert = 'success';
      textAlertTittle = 'Tenemos conexión a internet!'
      textAlertParagraph = 'Estamos trabajando con base de datos en la nube.';
      
      a.innerHTML = `<div class='alert alert-${typeAlert} mb-0 alert-dismissible fade show' role='alert'>` +
                    `<strong>${textAlertTittle}</strong> &nbsp;&nbsp; ${textAlertParagraph}` +
                    "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>"+
                    "</div>"      
                    
    } 
                  
    else {
      typeAlert = 'warning';
      textAlertTittle = '¡Estamos sin conexión a internet!';
      textAlertParagraph = 'Pero seguimos trabajando de manera local.';
      
      a.innerHTML = `<div class='alert alert-${typeAlert} mb-0 alert-dismissible fade show' role='alert'>` +
                    `<strong>${textAlertTittle}</strong>${textAlertParagraph}` +
                    "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>"+
                    "</div>"

    }

  }

}
