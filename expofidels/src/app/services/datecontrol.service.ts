import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatecontrolService {

  constructor() { }

  date() {
    
    //fecha control
    let date  = new Date();
    let anio  = date.getFullYear();
    let dia   = date.getDay();
    let mes   = date.getMonth();
    
    //tiempo control
    let min   = date.getMinutes();
    let sec   = date.getSeconds();
    let hor   = date.getHours();
    
    // console.log(min + ':' + sec);
    //-------------------------------------------------------------

    let dateNow = `${dia}-${mes}-${anio} : ${hor}:${min}:${sec} `;
    return dateNow;
    //-------------------------------------------------------------

  }

  intervalDate() {
    setInterval( () => this.date(), 1000 )    
  }

}
