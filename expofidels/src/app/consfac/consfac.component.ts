import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ControlprodService } from '../services/controlprod.service';
import { IndexedDBService } from '../services/indexed-db.service';
import Swal from 'sweetalert2';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';
import { TokenGenerateService } from '../services/token-generate.service';
import { EmailcontrolService } from '../services/emailcontrol.service';
import { Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { EmailServicesService } from '../services/email-services.service';


@Component({
  selector: 'app-consfac',
  templateUrl: './consfac.component.html',
  styleUrls: ['./consfac.component.styl']
})
export class ConsfacComponent implements OnInit {

  //foter INICIO
   public _footer = `POFIDEL - `;
  
  //foter FIN

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
  public _dateNow = new Date();
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
  // public _footer;
  public sumCantidad;
  public sumDespacho;
  //#endregion
  //----------------------- variables para la reportería de despacho FIN -----------------------------


  //observer VAR RXJS
  public observable: any;
  

  //--------------------------variables httpEventType INICIO -----------------------------------------
  //#region 
  public upload;
  public uploadTotal;
  public porcentUploadTotal;
  //#endregion
  //--------------------------variables httpEventType FIN -----------------------------------------

  //contenido de tabla a enviar por email
  public tableSend;

  constructor( public dataFact: ControlprodService,
               public iDB: IndexedDBService,
               private desSave: TInvcabgControllerService,
               public tGener: TokenGenerateService,
               public emServGen:EmailcontrolService,
               public emailReport: EmailServicesService) { }

  ngOnInit() {
    this.removesecuenceLocalStorage(1000);
    this.getFactType('0', '50');
    //this.datesNow();
    this.dbREAD('scanDB');
    this.scaningQR = Number(localStorage.getItem('scann_number'));
    this._bodega = localStorage.getItem('bodega');
    this._typ = localStorage.getItem('tipo');
    this._options = localStorage.getItem('factura_number');
    this._name = localStorage.getItem('nomCliente');

    //var tbodyRes = document.getElementById('tbody-arr');
    //console.log(tbodyRes);

    this.emServGen.getEmail().subscribe( email =>
    {
      this.em = email;
      this.typeGen = email[0].tipoDespa_web;
      sessionStorage.setItem('Tipo', this.typeGen);
    }, (err) => { })
    
  }

  resize(a,b,c,height){
    const ziner = document.getElementById(a);
    ziner.style.width = `${b}${c}`;
    ziner.style.top = '0px';
    ziner.style.left = '0px';
    if( height == 0 ) {
      ziner.style.height = screen.height + 'px';
    }
    else {
      ziner.style.height = height + 'px';
    }
  }

  close() {
    const tbodyReport = document.getElementById('domtab');
    const exbox = document.getElementById('exbox');
    //this._reportBool = false;
    exbox.style.display = 'none';
    
    for( let m = 0; m < 2000; m++ ){
      let atr = document.getElementById(`trTabReport-${m}`);
      tbodyReport.removeChild(atr);      
    }

    setTimeout(() => {
      location.reload();
    }, 1000);

  }

  removesecuenceLocalStorage(numberSecuenceClean: number) {
    for( let a = 0; a <= numberSecuenceClean; a++ ){
      localStorage.removeItem(`cantsScann-${a}`);
    }
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

      if( scab.type == HttpEventType.UploadProgress ){
        this.upload = scab.loaded / 1000000;
        this.uploadTotal = scab.total / 1000000; //total bytes to upload
        this.porcentUploadTotal = (this.upload / this.uploadTotal) * 100
        console.log(this.porcentUploadTotal + '...%');
        //document.getElementById('pBar').style.width = this.porcentUploadTotal + '%';
      }

      console.log(scab);
      console.log(this.arrFacts);
      
      if (scab.type === HttpEventType.Response) {

          for( let v = 0; v < this.arrFacts.length; v++ ) {
          
            this.arrDetSave = {
              T_llave:  sessionStorage.getItem('Session-Key'),
              tempo:    "despacho",
              linea:    this.arrFacts[v].linea,
              no_parte: this.arrFacts[v].no_parte,
              cantidad: localStorage.getItem(`scann-${v}`)
            }

            this.saveDetalle(this.arrDetSave);
            //console.log(this.arrDetSave);
          
          }

          setTimeout( () => {
            console.log('EXEC');
            this.exec();
          },1500 );
        
      }

      let v = document.getElementById('tbody-arr');
      setTimeout(() => {
        for( let y = 0; y < 2000; y++ ) {
          let atr = document.getElementById(`trPrincipal${y}`);
          v.removeChild(atr);
        }
      }, 1500);
      

    }, (err) => {

        console.log(err);

    })
    
  }
  //#endregion

  saveDetalle(content) {
    this.desSave.despachoSaveDet(content).subscribe(
      postDetail => {
        console.log(postDetail);
        this.removesecuenceLocalStorage(1000);
        this._reportBool = true;
      }
    )
  }


  public arrMailSendJSON: any = [];
  sendMail() {
    const tbodyReport = document.getElementById('domtab').outerHTML;
    this.arrMailSendJSON = {
      
      txtPara:   "andrenimacion@gmail.com",
      txtAsunto: `Reporte de despacho: ${this._n_reporte} `,
      txtCopia:  "syscompsasa@gmail.com",
      txtMensaje: `<div style="padding: 15px; border: solid 2px gray; 
                    border-top-right-radius: 5px; border-top-left-radius: 5px;">
                      <div>
                        <div> <strong> Reporte de despacho: </strong> ${this._n_reporte} </div>
                        <div> <strong> Cliente: </strong> ${this._cliente} </div><hr>
                      </div>
                      <div>
                        <div> <strong> Dirección: </strong> ${this._direccion}</div>
                        <div> <strong> Bodega: </strong> ${this._bodega} </div><hr>
                      </div>
                      <div>
                        <div> <strong> Concepto: </strong> ${this._concepto}</div>
                        <div> <strong> R.U.C.: </strong> ${this._ruc} </div><hr>
                      </div>
                      <div>
                        <div> <strong> Telefono: </strong> ${this._telefono}</div>
                        <div> <strong> Emision: </strong> ${this._emision}</div><hr>
                      </div>                      
                    </div>
                    <hr>
                    <div>
                    <table style="width: 100%;">
                    <thead style='background-color: #444; color: white;'>
                    <th>Detalle</th>
                    <th>Cantidad</th>
                    <th>Despachado</th>
                    <th>Total</th>
                    </thead>
                    <tbody style='background-color: #FAC193;'>
                      ${tbodyReport}
                    </tbody>
                    </table>
                    <hr style="border: dotted 2px gray;">
                    Fecha de vencimiento: ${this._f_vencimiento}
                    <h5><strong> POFIDEL - ${new Date()} - ECUADOR </strong></h5>
                    <strong>Nota:</strong> No responder este email...
                   </div>`,
      MailAddress:  "syscompsasa@gmail.com",
      passwordMail: "sysgye2016",
      date_send_mail: new Date()
      
    }
    
    console.log(this.arrMailSendJSON);
    this.emailReport.SendMailJson(this.arrMailSendJSON).subscribe( mail => {
      console.log(mail)
      Swal.fire({
        icon: 'success',
        title: 'Oops...',
        text: 'Se ha enviado el correo electrónico, con éxito!',
        // footer: 'Revisa tu conexión o la configuración de tu correo.'
      })
    }, () => {
      Swal.fire({
        icon: 'success',
        title: 'Bien...',
        text: 'Se ha enviado el correo electrónico, con éxito!',
        // footer: 'Revisa tu conexión o la configuración de tu correo.'
      })
    })
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
      // console.log(this.arrCursor);
      for(let i = 0; i <= this.arrCursor.length; i++ ) {

        //---------------------------------------------------------------
        //bucle para recorre la cabecera
        this._n_reporte = ` #${this.arrCursor[i].tipo + this.arrCursor[i].numero}`;
        this._cliente   = this.arrCursor[i].empcli;
        this._direccion = this.arrCursor[i].direccion;
        this._bodega    = this.arrCursor[i].bodega;
        this._concepto  = this.arrCursor[i].comenta;
        this._ruc       = this.arrCursor[i].ruc;
        this._telefono  = this.arrCursor[i].fono1;
        this._emision   = this.arrCursor[i].fechA_TRA;
        this._f_vencimiento   = this.arrCursor[i].fecha_ven;
        //---------------------------------------------------------------

        //Creamos la tabla y la insertamos como HTML
        const tbodyReport = document.getElementById('domtab'); 
        const create_tr = document.createElement('tr');
        
        let ctr = tbodyReport.appendChild(create_tr);
        create_tr.setAttribute('id', `trTabReport-${i}`);

        
        this.tableSend =  `<td style='font-size: 8pt;'>
                              ${this.arrCursor[i].nombre}
                           </td>
                           <td style='font-size: 8pt;'>
                              ${this.arrCursor[i].cantidad}
                           </td>
                           <td style='font-size: 8pt;'>
                              ${this.arrCursor[i].despacho}
                           </td>
                           <td style='font-size: 8pt;'>
                              ${this.arrCursor[i].cantidad - this.arrCursor[i].despacho}
                           </td>`;
        
        ctr.innerHTML = this.tableSend;
        
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
    //const tbodyReport = document.getElementById('domtab');
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
        create_tr.setAttribute('id', `trPrincipal${f}`)
        
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
