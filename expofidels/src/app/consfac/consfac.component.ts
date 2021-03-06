import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ControlprodService } from '../services/controlprod.service';
import { IndexedDBService } from '../services/indexed-db.service';
import Swal from 'sweetalert2';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';
import { TokenGenerateService } from '../services/token-generate.service';
import { EmailcontrolService } from '../services/emailcontrol.service';

@Component({
  selector: 'app-consfac',
  templateUrl: './consfac.component.html',
  styleUrls: ['./consfac.component.styl']
})
export class ConsfacComponent implements OnInit {

  public _searchFacts: string;

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

  constructor( public dataFact: ControlprodService,
               public iDB: IndexedDBService,
               private desSave: TInvcabgControllerService,
               public tGener: TokenGenerateService,
               public emServGen:EmailcontrolService  ) { }

  ngOnInit() {

    this.getFactsGen();

    //this.readDB('facturas-type-DB');
    // this.getFacts('_opt_', 'FA', '00000599', 'V');
    this.getFactType('0', '50');
    this.datesNow();
    this.dbREAD('scanDB');
    this.scaningQR = Number(localStorage.getItem('scann_number'));

    this.nombre      =    localStorage.getItem('p_nombre');
    this.codigo      =    localStorage.getItem('p_codigo');
    this.cantidad    =    localStorage.getItem('p_cantidad');
    this.escaneo     =    localStorage.getItem('p_escaneo');
    this.diferencia  =    localStorage.getItem('p_diferen');

    this._bodega = localStorage.getItem('bodega');
    this._typ = localStorage.getItem('tipo');
    this._options = localStorage.getItem('factura_number');
    this._name = localStorage.getItem('nomCliente');

    this.emServGen.getEmail().subscribe( email => {
      this.em = email;
      this.typeGen = email[0].tipoDespa_web
      sessionStorage.setItem('Tipo', this.typeGen);
      // console.log(this.typeGen);
    }, (err) => {})

  }

  getFactsGen() {    
    this.dataFact.getfacttypegen(0).subscribe( F => {
      this.arrFactsType = F;
      //console.log(this.arrFactsType);
      this.dataFact.createLibraryFacts(this.arrFactsType);
    })
  }

  

  // readDB(database) {
  //   var db;
  //   const DBopen = indexedDB.open(database, 1)
  //   DBopen.onsuccess = (e) => {
  //     db = DBopen.result;
  //     var transaction = db.transaction([database], 'readonly');
  //     var objectStore = transaction.objectStore(database);
  //     objectStore.openCursor().onsuccess = (e) => {       
  //       const cursor = e.target.result;
  //       if( cursor ) {          
  //         this.arrCursorFact.push(cursor.value);
  //         cursor.continue();
  //         console.log(this.arrCursorFact);
  //         return this.arrCursorFact;
  //       }
  //       else{
  //         console.log('Ya se han desplegado todos los datos');
  //       }        
  //     }
  //   }
  // }


  persData(nom, cod, cant, esc, dif) {

    localStorage.setItem('p_nombre',   nom);
    localStorage.setItem('p_codigo',   cod);
    localStorage.setItem('p_cantidad', cant);
    localStorage.setItem('p_escaneo',  esc);
    localStorage.setItem('p_diferen',  dif);

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

  datesNow() {  

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
          localStorage.setItem('scann_number', this.scaningQR.toString());
        
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

  public arrCabSave: any = [];
  public arrDetSave: any = [];
  public em: any = [];
  public Token = this.tGener.tGenerate(14);
  public dataOfflineDBRecovery: any = [];
  saveDespachoscab() {    
    sessionStorage.setItem('TOKEN', this.Token); 
    this.arrCabSave = {
      T_llave: this.Token,
      tempo: "tempo1",
      tipo: sessionStorage.getItem('Tipo'),
      fecha_tra: new Date(),
      bodega: localStorage.getItem('bodega'),
      usercla: "web_test",
      referencia: this.sliceNameFact + this.sliceNameFactB
    } 

    this.desSave.despachoSaveCab(this.arrCabSave).subscribe( scab => {
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
        html: `Transacci??n guardada exitosamente con token:<strong>${this.Token}</strong>`
      })
      
      this.saveDespachosdet();
      //console.log(scab);
      
    }, (err) => {

      Swal.fire(
        '??Problemas de conexi??n?',
        'Hemos guardado tu transacci??n en base de datos local. Con este token: ' + this.Token,
        'info'
      )

      this.dataOfflineDBRecovery = {
        T_llave: this.Token,
        tempo: "tempo1",
        tipo: sessionStorage.getItem('Tipo'),
        fecha_tra: new Date(),
        bodega: localStorage.getItem('bodega'),
        usercla: "web_test",
        referencia: this.sliceNameFact + this.sliceNameFactB,
        linea: Number(localStorage.getItem('linea')),
        no_parte: localStorage.getItem('no_parte'),
        cantidad: Number(localStorage.getItem('p_cantidad')),
      }
      
      this.createRecoveryDBTransaccional(this.dataOfflineDBRecovery);
      location.reload();

    })

  }


  createRecoveryDBTransaccional(data) {
    this.iDB.createIndexedDB('transaction-db', 1);
    this.iDB.saveDataIndexedDB('transaction-db', 1, data);
  }

  saveDespachosdet() {

    this.arrDetSave = {
      T_llave: this.Token,
      tempo: "tempo1",
      linea: Number(localStorage.getItem('linea')),
      no_parte: localStorage.getItem('no_parte'),
      cantidad: Number(localStorage.getItem('p_cantidad')),
    }

    console.log(this.arrDetSave);

    this.desSave.despachoSaveDet(this.arrDetSave).subscribe( sdet => {
      //console.log(sdet);
      
    }, (err) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'info',
        html: `Hemos tenido un problema, al guardar el<strong> detalle </strong>la siguiente transacci??n con el siguiente token :<strong>${this.Token}</strong>`
      })

      // alert('No se ha guardado el detalle');

    })

  }

  valdeteScann(a) {

    let b = <HTMLInputElement> document.getElementById('scann');

    localStorage.setItem('p_diferen', a);
    this.total = localStorage.getItem('p_diferen');

    if(a > localStorage.getItem('p_cantidad')) {
      this.scaningQR = Number(localStorage.getItem('p_cantidad'));
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'info',
        title: 'Haz eccedido el limite de escaneos con relaci??n a la cantidad estipulada'
      })

      b.disabled = true;

    }

  }


  getFactsUnit( type, top ) {
    this.dataFact.getfacttype(type, top).subscribe( typef => {
      this.arrFactsType = typef;
    }, (err)=> {
      console.log(err);
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

  

  getFacts(a,b,c,d) {
    let z = <HTMLInputElement> document.getElementById('scann');
    this.dataFact.getfactura(a,b,c,d).subscribe( FACTS => {
      this.arrFacts = FACTS;
      
      //this.dataFact.createLibraryFacts(this.arrFacts);
      
      this.scaningQR = 0;
      z.disabled = false;

      for( let k = 0; k <= this.arrFactsType.length; k++ ) {
        
           this._bodega = this.arrFacts[k].bodega;
           localStorage.setItem('bodega',   this.arrFacts[k].bodega);
           localStorage.setItem('cantidad', this.arrFacts[k].cantidad);
           localStorage.setItem('nomCliente', this.arrFacts[k].nomCliente);
           localStorage.setItem('comprobante', this.arrFacts[k].comprobante);
           localStorage.setItem('no_parte', this.arrFacts[k].no_parte);
           localStorage.setItem('linea', this.arrFacts[k].linea);
           this.total = this.arrFacts[k].cantidad - Number(localStorage.getItem('scann_number'));
           localStorage.setItem('total', this.total);
           
          //#region carga de informaci??n por medio del servicio

          /*1*/ this.persData(this.arrFacts[k].nomParte,
          /*2*/ this.arrFacts[k].no_parte,
          /*3*/ this.arrFacts[k].cantidad,
          /*4*/ localStorage.getItem('scann_number'),
          /*5*/ this.arrFacts[k].cantidad - Number(localStorage.getItem('scann_number')));
            
            //#region cambiando el storage
            this.nombre      =    localStorage.getItem('p_nombre');
            this.codigo      =    localStorage.getItem('p_codigo');
            this.cantidad    =    localStorage.getItem('p_cantidad');
            this.escaneo     =    localStorage.getItem('p_escaneo');
            this.diferencia  =    localStorage.getItem('p_diferen');
            //#endregion
           
          //#region


          if( localStorage.getItem('no_parte') != localStorage.getItem('cod_prod') ) {
            
            this.iDB.elBDData('scanDB');
            localStorage.removeItem('total');
            localStorage.removeItem('scann_number');
            localStorage.setItem('total', '0');
            localStorage.setItem('scann_number', '0');
            //console.log('Esto es diferente');

            Swal.fire({
              title: 'Se reiniciar?? los scaneos ya que el c??digo seleccionado es diferente',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            })
            
          }

          else {

            this.persData(this.arrFacts[k].nomParte,
                          this.arrFacts[k].no_parte,
                          this.arrFacts[k].cantidad,
                          localStorage.getItem('scann_number'),
                          this.arrFacts[k].cantidad - Number(localStorage.getItem('scann_number')));

                          //console.log('Esto es igual');

          }

        }

    }, (err) => {

      // console.log('No encontro la informacion' + err);
    
    })
  }

  getFactType(type, top) {

    this.dataFact.getfacttype(type, top).subscribe( typef => {
      this.arrFactsType = typef;
    })

  }


}
