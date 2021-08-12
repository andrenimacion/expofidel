import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZfillService {

  constructor() { }
  public numberOutput;
  zfill(number, width) {
    this.numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + this.numberOutput.toString()); 
        } else {
             return this.numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + this.numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + this.numberOutput.toString()); 
        }
    }
  }

  // PadLeft(value, length) {
  //   return (value.toString().length < length) ? this.PadLeft("0" + value, length) : 
  //   value;
  // }

  // PadLeft( number, width ) {
  // width -= number.toString().length;  
  // if ( width > 0 ) {
  //     return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  // }
  // return number + ""; // siempre devuelve tipo cadena
  // }

}
