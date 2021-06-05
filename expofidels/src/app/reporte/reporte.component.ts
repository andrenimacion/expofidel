import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.styl']
})
export class ReporteComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {

    //this.dbRead();
  
  }

  public _cliente: string;
  public _direccion: string;
  public _bodega: string;
  public _concepto: string;
  public _ruc: string;
  public _telefono: string;
  public _emision: string;
  public _f_vencimiento: string;

  
  public arrCursor: any = [];
  dbRead(bd) {
    console.log('leyendo data cabecera');
    var db;
    const request = indexedDB.open(bd, 1);

    //funcion que capta errores
    request.onerror = (error) => console.log(error);

    //funcion capta los requirimientos positivos de mis transacciones
    request.onsuccess = (e) => {
      db = request.result;
      const transaction =  db.transaction([bd], 'readwrite');
      const objectStore = transaction.objectStore(bd);
      objectStore.openCursor().onsuccess = (e) => {

      const cursor = e.target.result; 

        if( cursor ) {        
          this.arrCursor.push(cursor.value);
          cursor.continue();     
        }
      }
    }

    request.onupgradeneeded = () => {
      db = request.result;
      db.createObjectStore(bd, {
        autoIncrement: true
      });
    }
  }


}
