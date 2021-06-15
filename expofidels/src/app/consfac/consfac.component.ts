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

  //var report INICIO
  public _reportBool: boolean = false;
  //var report FIN

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
  
  /* ----------------------- variables para transacciones INICIO -------------------------------------------- */
  //#region 
  public arrCabSave: any = [];
  public arrDetSave: any = [];
  public em: any = [];
  public Token = this.tGener.tGenerate(14);
  public dataOfflineDBRecovery: any = [];
  //#endregion
  /* ----------------------- variables para transacciones FIN -------------------------------------------- */

  //----------------------- variables para la reportería de despacho INICIO -----------------------------
  //#region
  
  public _cliente: string;
  public _direccion: string;
  public _bodegaR: string;
  public _concepto: string;
  public _ruc: string;
  public _telefono: string;
  public _emision: string;
  public _f_vencimiento: string;  
  public _n_reporte: string;
  public _footer;
  public sumCantidad;
  public sumDespacho;
  //#endregion
  //----------------------- variables para la reportería de despacho FIN -----------------------------


  //observer VAR RXJS
  public observable: any;
  

  constructor( public dataFact: ControlprodService,
               public iDB: IndexedDBService,
               private desSave: TInvcabgControllerService,
               public tGener: TokenGenerateService,
               public emServGen:EmailcontrolService  ) { }

  ngOnInit() {
    //this.execReport();
    //this.deleteChilds('tbody-arr', document.getElementsByTagName('tr'));
    this.removesecuenceLocalStorage(1000);
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

  removesecuenceLocalStorage(numberSecuenceClean: number) {
    for( let a = 0; a <= numberSecuenceClean; a++ ){
      localStorage.removeItem(`cantsScann-${a}`);
    }
  }

  // createStructureDataTransac(data) {
  //   this.iDB.createIndexedDB('transac-control-db', 1);
  //   this.iDB.saveDataIndexedDB('transac-control-db', 1, data);
  // }


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

    console.log( this.arrCabSave );

    this.desSave.despachoSaveCab(this.arrCabSave).subscribe( scab => {     
      this.dataFact.getfactura('_opt_', this.sliceNameFact, this.sliceNameFactB, 'V' )
                   .subscribe( FACTS => {
        
        // Transaciiones generales;
        this.arrFacts = FACTS;  
        // this.createStructureDataTransac(this.arrFacts);

        /*Con este bucle recorremos el JSON de nuestra
         petición GET this.dataFact.getfactura(...)
         para enviar el resultado mediante
         un POST hacia la base de datos... */
        
        //console.log(this.arrFacts);

        this.observable = new Observable(subscriber => {
          subscriber.next(this.saveDespachos());
          for( let m = 0; m <= this.arrFacts.length; m++ ) {
            
            this.arrDetSave = {
              T_llave:  sessionStorage.getItem('Session-Key'),
              tempo:    "despacho",
              linea:    this.arrFacts[m].linea,
              no_parte: this.arrFacts[m].no_parte,
              cantidad: localStorage.getItem(`scann-${m}`)
            }

            subscriber.next(this.saveDetalle(this.arrDetSave));
    
          }

          subscriber.next(this.exec());
          subscriber.complete();
    
        });

      }

    )
    }, (err) => {
      console.log(err);
      // Swal.fire(
      //   '¿Problemas de conexión?',
      //   'Hemos guardado tu transacción en base de datos local. Con este token: ' + this.Token,
      //   'info'
      // )
    })
    
  }
  //#endregion

  saveDetalle(content) {
    this.desSave.despachoSaveDet(content).subscribe(
      postDetail => {
        console.log(postDetail);
        this.removesecuenceLocalStorage(1000);
      }
    )
  }
  
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
      
      this.arrCursor = exec;
      console.log(this.arrExec);
      this._reportBool = true;
      const v = document.getElementById('tbody-arr');  
      for(let i = 0; i <= this.arrCursor.length; i++ ) {
        //---------------------------------------------------------------
        //bucle para recorre la cabecera
        this._n_reporte = ` #${this.arrCursor[i][0].tipo + this.arrCursor[i][0].numero}`; 
        this._cliente   = this.arrCursor[i][0].empcli;
        this._direccion = this.arrCursor[i][0].direccion;
        this._bodega    = this.arrCursor[i][0].bodega;
        this._concepto  = this.arrCursor[i][0].comenta;
        this._ruc       = this.arrCursor[i][0].ruc;
        this._telefono  = this.arrCursor[i][0].fono1;
        this._emision   = this.arrCursor[i][0].fechA_TRA;
        this._f_vencimiento   = this.arrCursor[i][0].fecha_ven;            
        //---------------------------------------------------------------
        //bucle para recorrer el detalle
        for(let f = 0; f <= this.arrCursor[i].length; f++) {              
          const create_tr = document.createElement('tr');
          //const create_td = document.createElement('td');
          let ctr = v.appendChild(create_tr);
          this.sumCantidad = Number(this.arrCursor[i][f].cantidad);
          ctr.innerHTML = `<td style='font-size: 8pt;'>
                            ${this.arrCursor[i][f].nombre}
                           </td>
                           <td style='font-size: 8pt;'>
                            ${this.arrCursor[i][f].cantidad}
                           </td>
                           <td style='font-size: 8pt;'>
                            ${this.arrCursor[i][f].despacho}
                           </td>
                           <td style='font-size: 8pt;'>
                            ${this.arrCursor[i][f].cantidad 
                            - this.arrCursor[i][f].despacho }
                           </td> `;
        }
      } 
    })
  }

  // public exeReportArr: any = [];
  // execReport() {    

  //   // console.log(localStorage.getItem('Comprobante-type'), localStorage.getItem('Comprobante-number'));

  //   this.desSave.getExecReport(sessionStorage.getItem('Session-Key'), 'despacho').subscribe (execr => {

  //     this.exeReportArr = execr;
  //     //this.getComprobantController(this.exeReportArr);
  //     console.log(this.exeReportArr);

  //   })
  // } 

  //this.exec(sessionStorage.getItem('Session-Key'), 'despacho')
  // controlSaveDataObserver() {
  
  //   this.observable = new Observable(subscriber => {
  //     subscriber.next(this.saveDespachos());
  //     subscriber.complete();

  //   });
  
  //   this.rxjsFunction();
  
  // }

  // rxjsFunction() {
    
  //   this.observable.subscribe({
  //     next(x) { x },
  //     error(err) { console.error('Ha ocurrido un error de ejecución: ' + err); },
  //     complete() {
        
  //       const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-start',
  //         showConfirmButton: false,
  //         timer: 5000,
  //         timerProgressBar: true,
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer)
  //           toast.addEventListener('mouseleave', Swal.resumeTimer)
  //         }
  //       })
        
  //       Toast.fire({
  //         icon: 'success',
  //         html: `Transacción guardada exitosamente
  //                con token:<strong>${sessionStorage.getItem('Session-Key')}</strong>`
  //               })

  //      }

  //     });
      
  // }
    
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
    let v = document.getElementById('tbody-arr');
    //let z = <HTMLInputElement> document.getElementById('scann');
    this.dataFact.getfactura(a,b,c,d).subscribe( FACTS => {
      this.arrFacts = FACTS;
      console.log(this.arrFacts);

      //variables para localstorage
      
      localStorage.setItem('bodega', this.arrFacts[0].bodega);
      this._bodega = localStorage.getItem('bodega');

      //this.createStructureDataTransac(this.arrFacts);
      this.scaningQR = 0;

      for(let f = 0; f <= this.arrFacts.length; f++) {
        
        const create_tr = document.createElement('tr');
        //const create_td = document.createElement('td'); 
        
        let ctr = v.appendChild(create_tr);
        //this.sumCantidad = Number(this.arrCursor[i][f].cantidad);
        let opertoral;
        const operMath = ( op1, op2 ) => {
          opertoral = op1 - op2;
          console.log(opertoral);
          return opertoral;
        }        
        
        ctr.innerHTML = `<td style='font-size: 8pt;'>
        ${this.arrFacts[f].no_parte}
        </td>
        <td style='font-size: 8pt;'>
        ${this.arrFacts[f].nomParte}
        </td>
        <td style='font-size: 8pt;'>
        ${this.arrFacts[f].cantidad}
        </td>
        <td style='font-size: 8pt;'>
        <input type="number" id="idInput-${f}" style="color: gray !important;" >
        </td>
        <td style='font-size: 8pt;'>
          <span id="sp-${f}" ></span>
        </td>`;

        //EVENTOS CREADOS PARA LA TABLA
        //#region addeventlisteners
        let bID = <HTMLInputElement> document.getElementById(`idInput-${f}`);

        this.cotrolEventListeners(`idInput-${f}`, `sp-${f}`, 'change', this.arrFacts[f].cantidad, f);
        this.cotrolEventListeners(`idInput-${f}`, `sp-${f}`, 'click',  this.arrFacts[f].cantidad, f);
        this.cotrolEventListeners(`idInput-${f}`, `sp-${f}`, 'keyup',  this.arrFacts[f].cantidad, f);        

        //#endregion
        
        

      }

    }, (err) => {

      console.log('No encontro la informacion' + err);
    
    })
  }

  deleteChilds(objectID, removeObject) {
    document.getElementById(objectID).removeChild(removeObject);
  }

  cotrolEventListeners(objectID, spanID, EVENT, valueB, secuence) {
    const valueID = <HTMLInputElement> document.getElementById(objectID);
    const sID = <HTMLInputElement> document.getElementById(spanID);
    valueID.addEventListener( EVENT, () => {
      if( Number(valueID.value) > valueB ) {
        //valueID.disabled = true;
        valueID.style.border = 'solid 1px yellowgreen';
        sID.innerText = '0';
        valueID.value = valueB;
        localStorage.setItem(`cantsScann-${secuence}`, valueB);
        Swal.fire({
          icon: 'error',
          title: 'Hey',
          text: 'Has llegado al límite!"'
        })
      }
      else {
        //valueID.disabled = false;
        sID.innerText = (valueB - Number(valueID.value)).toString();
        localStorage.setItem(`cantsScann-${secuence}`, (valueB - Number(valueID.value)).toString())
        localStorage.setItem(`scann-${secuence}`, (Number(valueID.value)).toString())
      }
    })
  }

  //#endregion

  getFactType(type, top) {
    this.dataFact.getfacttype(type, top).subscribe( typef => {
      this.arrFactsType = typef;
    })

  }



}
