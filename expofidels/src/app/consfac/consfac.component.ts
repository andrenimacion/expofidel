import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ControlprodService } from '../services/controlprod.service';

@Component({
  selector: 'app-consfac',
  templateUrl: './consfac.component.html',
  styleUrls: ['./consfac.component.styl']
})
export class ConsfacComponent implements OnInit {

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

  constructor( public dataFact: ControlprodService ) { }

  ngOnInit() {
    this.getFacts('_opt_', 'FA', '00000599', 'V');
    this.getFactType('0', '50');
    this.datesNow();
    this.dbREAD('register-scann');
    //localStorage.removeItem('cp');
    //this.deleteBD('register-scann', 'register-scann')
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
    this.scaningQR = Number(localStorage.getItem('cp'));
 
  
  }

  sliceNameFactF = (a, b) => {

    this.sliceNameFact = a.slice(0,2)
    this._typ = this.sliceNameFact;
    this.sliceNameFactB = a.slice(2,10)
    this._options = this.sliceNameFactB;
    //console.log( this._typ );
    this._name = b;
    this.getFacts( '_opt_', this.sliceNameFact, this.sliceNameFactB, 'V' );

  };

  datesNow() {  

    let fecha = new Date();
    let year = fecha.getFullYear();
    let day = fecha.getDay();
    let month = fecha.getMonth();
    return this._dateNow = `${month}/${day}/${year}`;
    // console.log(this._dateNow); 
    
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
      const objectStore = db.createObjectStore(bd, {
        autoIncrement: true
      });      
    }

  }


  makeTX(storeName, mode) {
    let tx = this.db.transaction(storeName, mode);
    tx.onerror = (err) => {
      console.warn(err);
    };
    return tx;
  }

  clearForm(ev) {
    if (ev) ev.preventDefault();
    // document.whiskeyForm.reset();
  }

  getFacts(a,b,c,d) {
    
    this.dataFact.getfactura(a,b,c,d).subscribe( FACTS => {
      this.arrFacts = FACTS;

      for( let k = 0; k <= this.arrFactsType.length; k++ ) {
        
           this._bodega = this.arrFacts[k].bodega;
           localStorage.setItem('bodega',   this.arrFacts[k].bodega);
           localStorage.setItem('cantidad', this.arrFacts[k].cantidad);
           localStorage.setItem('no_parte', this.arrFacts[k].no_parte);

      }

    }, err => {
       console.log('No encontro la informacion');
    })
  }

  getFactType(type, top) {

    this.dataFact.getfacttype(type, top).subscribe( typef => {
      this.arrFactsType = typef;
    })

  }


}
