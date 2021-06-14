import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ControlprodService } from '../services/controlprod.service';
import { IndexedDBService } from '../services/indexed-db.service';
import Swal from 'sweetalert2';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';
import { TokenGenerateService } from '../services/token-generate.service';
import { EmailcontrolService } from '../services/emailcontrol.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-consfac',
  templateUrl: './consfac.component.html',
  styleUrls: ['./consfac.component.styl']
})
export class ConsfacComponent implements OnInit {

  public _searchFacts: string;
  public seesionToken = sessionStorage.getItem('Session-Key');
  public arrFacts: any = [];
  public arrFactsType: any = [];
  public _options: string;
  public sliceNameFact: string;
  public sliceNameFactB: string;
  public _typ: string;
  public _bodega: string;
  public _dateNow;
  public _name: string;
  public scaningQR: number;
  public total: any;
  public db;
  
  //#region persistencia de datos para la tabla  
  public codigo;
  public nombre;
  public cantidad;
  public escaneo;
  public diferencia;  
  //#endregion 
  public typeGen: string;
  public arrCursorFact:any = [];
  
  /* variables para transacciones */
  //#region 
  public arrCabSave: any = [];
  public arrDetSave: any = [];
  public em: any = [];
  public Token = this.tGener.tGenerate(14);
  public dataOfflineDBRecovery: any = [];
  //#endregion

  constructor( public dataFact: ControlprodService,
    public iDB: IndexedDBService,
               private desSave: TInvcabgControllerService,
               public tGener: TokenGenerateService,
               public emServGen:EmailcontrolService  ) { }

  ngOnInit() {
    //this.execReport();
    this.getFactType('0', '50');
    this.datesNow();
    this.dbREAD('scanDB');
    this.scaningQR = Number(localStorage.getItem('scann_number'));
    this._bodega = localStorage.getItem('bodega');
    this._typ = localStorage.getItem('tipo');
    this._options = localStorage.getItem('factura_number');
    this._name = localStorage.getItem('nomCliente');

    this.emServGen.getEmail().subscribe( email =>
    {
      this.em = email;
      this.typeGen = email[0].tipoDespa_web;
      sessionStorage.setItem('Tipo', this.typeGen);
    },
    (err) => { })
    
  }

  createStructureDataTransac(data) {
    this.iDB.createIndexedDB('transac-control-db', 1);
    this.iDB.saveDataIndexedDB('transac-control-db', 1, data);
  }


  sliceNameFactF = (a, b) => {  
    this.sliceNameFact = a.slice(0,2);
    this._typ = this.sliceNameFact;
    localStorage.setItem('tipo', this.sliceNameFact);
    this.sliceNameFactB = a.slice(2,10);
    localStorage.setItem('factura_number', this.sliceNameFactB);
    this._options = this.sliceNameFactB;
    this._name = b;
    this.getFacts( '_opt_', this.sliceNameFact, this.sliceNameFactB, 'V' );  
  }

  datesNow(): string {

    let fecha = new Date();
    let year = fecha.getFullYear();
    let day = fecha.getDay();
    let month = fecha.getMonth();
    return this._dateNow = `${month}/${day}/${year}`; 
  
  }

  public arrCursor: any = [];
  dbREAD(bd) {

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
          this.scaningQR = this.arrCursor.length;
          localStorage.setItem(bd, this.scaningQR.toString());        
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


  /* ------- GUARDAMOS LA CABECERA DE LA TRANSACCIÓN ------- */
  //#region 
  saveDespachos() {    
    sessionStorage.setItem('TRANSACCION-KEY', this.Token); 
    sessionStorage.removeItem('TOKEN');

    this.arrCabSave = {
      T_llave: sessionStorage.getItem('Session-Key'),
      tempo: "despacho",
      tipo: sessionStorage.getItem('Tipo'),
      fecha_tra: new Date(),
      bodega: localStorage.getItem('bodega'),
      usercla: sessionStorage.getItem('Token-User'),
      referencia: this.sliceNameFact + this.sliceNameFactB
    }

    this.desSave.despachoSaveCab(this.arrCabSave).subscribe( scab => {     
      this.dataFact.getfactura('_opt_', this.sliceNameFact, this.sliceNameFactB, 'V' ).subscribe( FACTS => {
       
        // Transaciiones generales
        this.arrFacts = FACTS;  
        this.createStructureDataTransac(this.arrFacts);
        this.exec();

        /*Con este bucle recorremos el JSON de nuestra petición GET this.dataFact.getfactura(...)
          para enviar el resultado mediante un POST hacia la base de datos... */
        
        for( let m = 0; m <= this.arrFacts.length; m++ ) {
        
          this.arrDetSave = {

            T_llave:  sessionStorage.getItem('Session-Key'),
            tempo:    "despacho",
            linea:    this.arrFacts[m].linea,
            no_parte: this.arrFacts[m].no_parte,
            cantidad: this.arrFacts[m].cantidad

          }
  
          this.desSave.despachoSaveDet(this.arrDetSave).subscribe(
            postDetail => {
              console.log(postDetail);
            }  
          )        
        }
      }
    )
    }, (err) => {

      Swal.fire(
        '¿Problemas de conexión?',
        'Hemos guardado tu transacción en base de datos local. Con este token: ' + this.Token,
        'info'
      )
    })
    
  }
  //#endregion



  /* -------CREAMOS UNA BASE DE DATOS LOCAL
  DONDE GUARDAMOS LA CABECERA DE LA TRANSACCIÓN ------- */
  // createRecoveryDBTransaccional(data) {
  //   this.iDB.createIndexedDB('transaction-db', 1);
  //   this.iDB.saveDataIndexedDB('transaction-db', 1, data);
  // }


  
  getComprobantController(data) {
    this.iDB.createIndexedDB('comprobant-db', 1);
    this.iDB.saveDataIndexedDB('comprobant-db', 1, data);
  }
  
  public arrExec: any = [];
  public comproba: string;
  public comprobaA: string;
  public comprobaB: string;

  exec() {

    this.desSave.getExec(this.seesionToken, 'despacho').subscribe( exec => {
      
      this.arrExec = exec;
      this.comproba = this.arrExec[0].comproba;
      this.comprobaA = this.comproba.slice(0,2);
      this.comprobaB = this.comproba.slice(2,10);
      localStorage.setItem('Comprobante-type', this.comprobaA);
      localStorage.setItem('Comprobante-number', this.comprobaB);
      console.log(this.comproba);
    
    })
  }

  public exeReportArr: any = [];
  execReport() {    
    this.desSave.getExecReport(localStorage.getItem('Comprobante-type'), localStorage.getItem('Comprobante-number')).subscribe (execr => {

      this.exeReportArr = execr;
      this.getComprobantController(this.exeReportArr);
      console.log(this.exeReportArr);

    })
  } 



  public observable: any;
  //this.exec(sessionStorage.getItem('Session-Key'), 'despacho')
  controlSaveDataObserver() {
  
    this.observable = new Observable(subscriber => {
      subscriber.next(this.saveDespachos());
      subscriber.next(this.execReport());
      subscriber.complete();
    });
  
    this.rxjsFunction();
  
  }


  rxjsFunction() {
    
    this.observable.subscribe({
      next(x) { x },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() { 

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          html: `Transacción guardada exitosamente
                 con token:<strong>${sessionStorage.getItem('Session-Key')}</strong>`
                })

       }

      });
      
    }
    
public _value: any = 0; 
valdeteScann() {    
    // localStorage.setItem('p_diferen', a);
    //this.total = localStorage.getItem('p_diferen');
    
    let b = document.getElementsByTagName('input');    
    let ta = document.getElementsByTagName('textarea');    
    for ( let mi = 0; mi < 1000; mi++ ) {
      
      for ( let ma: number = 8; ma < b.length; ma ++ ) {

            b[ma].setAttribute('id', `id-${ma}`);
            let c = <HTMLInputElement> document.getElementById(`id-${ma}`);
            localStorage.setItem(`scan-qr-${ma}`, (Number(c.value)).toString());

            console.log(localStorage.setItem(`diferencia-${mi}`, (Number(this.arrFacts[mi++].cantidad) - Number(c.value)).toString()));

          }
          
        }
        
        // if(a > localStorage.getItem('p_cantidad')) {
          //   this.scaningQR = Number(localStorage.getItem('p_cantidad'));
          //   const Toast = Swal.mixin({
            //     toast: true,
            //     position: 'top-end',
            //     showConfirmButton: false,
            //     timer: 5000,
            //     timerProgressBar: true,
            //     didOpen: (toast) => {
              //       toast.addEventListener('mouseenter', Swal.stopTimer)
              //       toast.addEventListener('mouseleave', Swal.resumeTimer)
              //     }
              //   })
              
              //   Toast.fire ({
                //     icon: 'info',
                //     title: 'Haz eccedido el limite de escaneos con relación a la cantidad estipulada'
                //   })
                
                //   b.disabled = true;
                
                // }
                
              }
              
              
              getFactsUnit( type, top ) {
                this.dataFact.getfacttype(type, top).subscribe( typef => {
                  this.arrFactsType = typef;
                  console.log(this.arrFactsType);
                }, (err)=> {      
                  Swal.fire({
                    
                    title: 'No se pudo concretar tu busqueda',
                    showClass: {
                      popup: 'animate__animated animate__fadeInDown'
                    },
                    
                    hideClass: {
                      popup: 'animate__animated animate__fadeOutUp'
                    }
                    
                  })
                })
              }
              
              /*  OBTIENE LA CABECERA Y DETALLE DE LA FACTURA A SELECCIONAR */
              //#region
              
  getFacts(a,b,c,d) {
    //let z = <HTMLInputElement> document.getElementById('scann');
    this.dataFact.getfactura(a,b,c,d).subscribe( FACTS => {
      this.arrFacts = FACTS;
      // esto es las transaciiones generales
      this.createStructureDataTransac(this.arrFacts);
      this.scaningQR = 0;
      //z.disabled = false;
      
      for( let k = 0; k < this.arrFacts.length; k++ ) {
        console.log('funcionando');
        
          this._bodega = this.arrFacts[k].bodega;          
          localStorage.setItem(`cantidad-${k}`, this.arrFacts[k].cantidad);
          //localStorage.setItem(`diferencia-${k}`, this.arrFacts[k].cantidad);

        }

    }, (err) => {

      console.log('No encontro la informacion' + err);
    
    })
  }

  //#endregion

  getFactType(type, top) {
    this.dataFact.getfacttype(type, top).subscribe( typef => {
      this.arrFactsType = typef;
    })

  }


}
