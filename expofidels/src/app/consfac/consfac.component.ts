import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ControlprodService } from '../services/controlprod.service';
import { IndexedDBService } from '../services/indexed-db.service';
import Swal from 'sweetalert2';

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

  constructor( public dataFact: ControlprodService, public iDB: IndexedDBService ) { }

  ngOnInit() {
    this.getFacts('_opt_', 'FA', '00000599', 'V');
    this.getFactType('0', '50');
    this.datesNow();
    this.dbREAD('scanDB');
    this.scaningQR = Number(localStorage.getItem('scann_number'));  

    this.nombre      =    localStorage.getItem('p_nombre');
    this.codigo      =    localStorage.getItem('p_codigo');
    this.cantidad    =    localStorage.getItem('p_cantidad');
    this.escaneo     =    localStorage.getItem('p_escaneo');
    this.diferencia  =    localStorage.getItem('p_diferen');


  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.    
  }

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
    this.sliceNameFactB = a.slice(2,10);
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
    
    this.dataFact.getfactura(a,b,c,d).subscribe( FACTS => {
      this.arrFacts = FACTS;
      console.log(this.arrFacts);
      for( let k = 0; k <= this.arrFactsType.length; k++ ) {
        
           this._bodega = this.arrFacts[k].bodega;
           localStorage.setItem('bodega',   this.arrFacts[k].bodega);
           localStorage.setItem('cantidad', this.arrFacts[k].cantidad);
           localStorage.setItem('no_parte', this.arrFacts[k].no_parte);
           this.total = this.arrFacts[k].cantidad - Number(localStorage.getItem('scann_number'));
           localStorage.setItem('total', this.total);
           
          //#region carga de información por medio del servicio

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
            console.log('Esto es diferente');

            Swal.fire({
              title: 'Se reiniciará los scaneos ya que el código seleccionado es diferente',
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

                          console.log('Esto es igual');

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
