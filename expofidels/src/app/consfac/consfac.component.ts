import { Component, OnInit } from '@angular/core';
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

  constructor( public dataFact: ControlprodService ) { }

  ngOnInit() {
    this.getFacts('_opt_', 'FA', '00000599', 'V');
    this.getFactType('0', '50');
    this.datesNow();
  }

  sliceNameFactF = (a) => {
    this.sliceNameFact = a.slice(0,2)
    this._typ = this.sliceNameFact;
    this.sliceNameFactB = a.slice(2,10)
    this._options = this.sliceNameFactB;
    console.log( this._typ );

    this.getFacts( '_opt_', this.sliceNameFact, this.sliceNameFactB, 'V' )

  };

  datesNow() {  

    let fecha = new Date();
    let year = fecha.getFullYear();
    let day = fecha.getDay();
    let month = fecha.getMonth();
    this._dateNow = `${month}/${day}/${year}`;
    console.log(this._dateNow);  
    
  }


  getFacts(a,b,c,d) {
    
    //console.log('HOla2')
    this.dataFact.getfactura(a,b,c,d).subscribe( FACTS => {
      this.arrFacts = FACTS;
      console.log(this.arrFacts);

      for( let k = 0; k <= this.arrFactsType.length; k++ ) {
        this._bodega = this.arrFacts[k].bodega;
        console.log(this.arrFacts[k].bodega)
      }

    }, err => {
      console.log('No encontro la informacion')
    })
  }

  getFactType(type, top) {
    this.dataFact.getfacttype(type, top).subscribe( typef => {
      this.arrFactsType = typef;
      console.log(this.arrFactsType);

      // for( let k = 0; k <= this.arrFactsType.length; k++ ) {
      //   this.arrFactsType[k].comproba;
      // }

    } )
  }


}
