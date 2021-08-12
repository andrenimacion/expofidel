import { Component, OnInit } from '@angular/core';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.styl']
})
export class ReporteComponent implements OnInit {
  
  constructor( private dReport: TInvcabgControllerService ) { }

  ngOnInit() {

    //this.dbRead('comprobant-db');  
    this.getReport();
    const foot = document.getElementById('foot');
    this._footer = `Los precios de la siguiente Cotización estan sujetos a cambio sin previo aviso
                    Matriz: Chile 1810/12 y Gomez Rendon   Telefono: 2414-732 -  2414-775 Email: Ventas@ibea.com.ec 
                    Sucursal: Urdesa Central Av. Jorge Perez Concha 321 y calle diagonal Telefono: 6007373 - 2386121
                    Email: Infosucursal@ibea.com.ec - rgarcia@ibeasa.co`;
  
  }


  public _cliente: string;
  public _direccion: string;
  public _bodega: string;
  public _concepto: string;
  public _ruc: string;
  public _telefono: string;
  public _emision: string;
  public _f_vencimiento: string;  
  public _n_reporte: string;
  public _footer;

  //operaciones
  public sumCantidad;
  public sumDespacho;

  public arrCursor: any = [];

  // dbRead(bd) {
  //   //console.log('leyendo data cabecera');
  //   var db;
  //   const request = indexedDB.open(bd, 1); 
  //   request.onerror = (error) => console.log(error);
  //   let v = document.getElementById('tbody-arr');    
  //   //funcion capta los requirimientos positivos de mis transacciones
  //   request.onsuccess = (e) => {
  //     db = request.result;
  //     const transaction =  db.transaction([bd], 'readwrite');
  //     const objectStore = transaction.objectStore(bd);
  //     objectStore.openCursor().onsuccess = (e) => {        
  //       const cursor = e.target.result; 
  //       if( cursor ) {        
  //         this.arrCursor.push(cursor.value);
  //         cursor.continue();
  //         console.log(this.arrCursor);          
          // for(let i = 0; i <= this.arrCursor.length; i++ ) {
          //   //---------------------------------------------------------------
          //   //bucle para recorre la cabecera
          //   this._n_reporte = ` #${this.arrCursor[i][0].tipo + this.arrCursor[i][0].numero}`; 
          //   this._cliente   = this.arrCursor[i][0].empcli;
          //   this._direccion = this.arrCursor[i][0].direccion;
          //   this._bodega    = this.arrCursor[i][0].bodega;
          //   this._concepto  = this.arrCursor[i][0].comenta;
          //   this._ruc       = this.arrCursor[i][0].ruc;
          //   this._telefono  = this.arrCursor[i][0].fono1;
          //   this._emision   = this.arrCursor[i][0].fechA_TRA;
          //   this._f_vencimiento   = this.arrCursor[i][0].fecha_ven;          
          //   //---------------------------------------------------------------
          //   //bucle para recorrer el detalle
          //   for(let f = 0; f <= this.arrCursor[i].length; f++) {              
          //     const create_tr = document.createElement('tr');
          //     const create_td = document.createElement('td');               
          //     let ctr = v.appendChild(create_tr);
          //     this.sumCantidad = Number(this.arrCursor[i][f].cantidad);
          //     ctr.innerHTML = `<td style='font-size: 8pt;'>
          //                       ${this.arrCursor[i][f].nombre}
          //                      </td>
          //                      <td style='font-size: 8pt;'>
          //                       ${this.arrCursor[i][f].cantidad}
          //                      </td>
          //                      <td style='font-size: 8pt;'>
          //                       ${this.arrCursor[i][f].despacho}
          //                      </td>
          //                      <td style='font-size: 8pt;'>
          //                       ${this.arrCursor[i][f].cantidad 
          //                       - this.arrCursor[i][f].despacho }
          //                      </td> `;
          //   }
          // }          
  //       }
  //     }
  //   }
  //   request.onupgradeneeded = () => {
  //     db = request.result;
  //     db.createObjectStore(bd, {
  //       autoIncrement: true
  //     });
  //   }
  // }

  getReport() {
    
    this.dReport.getExec( sessionStorage.getItem('Session-Key') ,'despacho')
                .subscribe( report => {
                            console.log(report);
    })

  }

}
