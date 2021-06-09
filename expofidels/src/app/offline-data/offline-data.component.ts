import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IndexedDBService } from '../services/indexed-db.service';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';

@Component({
  selector: 'app-offline-data',
  templateUrl: './offline-data.component.html',
  styleUrls: ['./offline-data.component.styl']
})
export class OfflineDataComponent implements OnInit {

public arrCursor:any = [];
  
  constructor( private dbIDB: IndexedDBService, public transac: TInvcabgControllerService ) { }

  ngOnInit() { 

    /* leyendo las transacciones que estan 
    guardadas en data interna listas para ser subidas
    a la nube */

    //console.log('--------Leyendo las transacciones offline------')

    //this.readDB('transaction-db');

  }

  readDB(database) {
    
    var db;
    const DBopen = indexedDB.open(database, 1)
    DBopen.onsuccess = (e) => {
      db = DBopen.result;
      var transaction = db.transaction([database], 'readonly');
      var objectStore = transaction.objectStore(database);
      objectStore.openCursor().onsuccess = (e) => {       
        const cursor = e.target.result;
        if( cursor ) {
          this.arrCursor.push(cursor.value);
          cursor.continue();
          console.log(this.arrCursor);
          return this.arrCursor;
        }

        else {
          console.log('Ya se han desplegado todos los datos');
        }
        
      }
    }
  }


  limpiarData() {

    console.log('Borrando')

    Swal.fire({
      title: 'Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbIDB.elBDData('transaction-db');
        this.readDB('transaction-db');
        Swal.fire(
          'Borrado!',
          'Se ha limpiado la Base de datos local, que corresponde a la tabla de transaccionabilidad',
          'success'
        )
        location.reload();
      }
    })
  }

  public arrCabSave: any = [];
  public arrDetSave: any = [];

  sincronizarData() {
    
    //#region Sincronizacón de cabecera

    this.arrCabSave = {
      T_llave: sessionStorage.getItem('TOKEN'),
      tempo: "tempo1",
      tipo: sessionStorage.getItem('Tipo'),
      fecha_tra: new Date(),
      bodega: localStorage.getItem('bodega'),
      usercla: "web_test",
      referencia: localStorage.getItem('comprobante')
    }

    this.transac.despachoSaveCab(this.arrCabSave).subscribe( cab => {
      console.log('Cabecera sincronizada');
    })
    
    //#endregion    

    //#region Sincronización detalle

    this.arrDetSave = {
      T_llave: sessionStorage.getItem('TOKEN'),
      tempo: "tempo1",
      linea: Number(localStorage.getItem('linea')),
      no_parte: localStorage.getItem('no_parte'),
      cantidad: Number(localStorage.getItem('p_cantidad')),
    }
    this.transac.despachoSaveDet(this.arrDetSave).subscribe( det => {
      console.log('Detalle sincronizado');
    })

    //#endregion 
  
  }

}
