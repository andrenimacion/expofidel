import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  public cabecera: any = [];
  public detalle:  any = [];
  
  constructor() { }

  cab(t_llave, Tempo, Tipo, Bodega, Usercla, Referencia) {
    this.cabecera = {
      T_llave: t_llave,
      tempo: Tempo,
      tipo: Tipo,
      fecha_tra: new Date(),
      bodega: Bodega,
      usercla: Usercla,
      referencia: Referencia
    }
  }

  detail(a, b, c, d, e) {
      this.detalle = {
      T_llave:  a,
      tempo:    b,
      linea:    c,
      no_parte: d,
      cantidad: e
    }  
  }


}
