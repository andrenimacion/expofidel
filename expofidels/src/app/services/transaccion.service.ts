import { Injectable } from '@angular/core';
import { TInvcabgControllerService } from './t-invcabg-controller.service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  public cabecera: any = [];
  public detalle:  any = [];
  
  constructor( private transacc: TInvcabgControllerService ) { }

  cab(t_llave, Tempo, Tipo, Bodega, Usercla, Referencia, Consumo) {
    this.cabecera = {
      T_llave: t_llave,
      tempo: Tempo,
      tipo: Tipo,
      fecha_tra: new Date(),
      bodega: Bodega,
      usercla: Usercla,
      referencia: Referencia,
      consumo: Consumo,
    }

    console.log(this.cabecera);

    this.transacc.despachoSaveCab(this.cabecera).subscribe( x => {
      console.log(x);
    }, () => {
      console.log('Algo ha ocurrido');
    } )

  }

  detail(tllave, tempo, linea, noparte, cantidad) {
    this.detalle = {
      t_llave:  tllave,
      tempo:    tempo,
      linea:    linea,
      no_parte: noparte,
      cantidad: cantidad
    }
    this.transacc.despachoSaveDet(this.detalle).subscribe( y => {
      console.log(y)
    })
  }


}
