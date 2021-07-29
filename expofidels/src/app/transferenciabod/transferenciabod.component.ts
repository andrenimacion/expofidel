import { Component, OnInit } from '@angular/core';
import { TransferbodService } from '../services/transferbod.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-transferenciabod',
  templateUrl: './transferenciabod.component.html',
  styleUrls: ['./transferenciabod.component.styl']
})
export class TransferenciabodComponent implements OnInit {

  constructor( public gb: TransferbodService, public route: Router, public report: TInvcabgControllerService ) { }

  public repoBool: boolean = false;
  public _tipoCosto = 'PROM';
  public _observ: string;

  public arrBodegas: any = [];
  public boolBodegas: boolean = false;
  public boolBodegasB: boolean = false;
  public _bodser: string;
  public _bodserB: string;
  public _boolTableShow: boolean = false;

  public _bodserBool: boolean = false;
  public boolBodOri: boolean = true;

  public _codProd: string;
  public _dateProd: string;
  
  public prodBodArr: any = [];
  
  public _boolLift: boolean = false;
  
  public x: string;
  
  public _cod;
  public _desc;
  public _pres;
  public _cant;
  public _cnti;
  
  public codigo;
  
  public arrTransac: any = [];
  
  public _transaccion: string;
  public tTransBool: boolean = false;
  public _fechaAct: any = new Date();

  public _STCK;

  public codTransac: string;
  
  ngOnInit() {
    this.gBodegas('0');
    this.getTransacs();
    sessionStorage.setItem('tipo_costo', this._tipoCosto);
    this._fechaAct.toString().slice(0,8);

  
  }

  
  public count: number = 1;
  public comproba: any;
  public repoArr: any = [];
  public bod_ori: string;
  public bod_desti: string;
  public fech_emi;
  public fech_tran;
  public us_cla;
  public _observerrep;
  public _numero;
  public _tipoTran;

  transferir(a) {

    console.log(a);
    let modelCab = {
      T_llave   : sessionStorage.getItem('Session-Key'),    
      tempo     : 'transferencia',    
      tipo      : sessionStorage.getItem('tipos-trans'),
      fecha_tra : this.modifyDate(),
      bodega    : sessionStorage.getItem('cod_bod_transfer'),
      bodega_d  : sessionStorage.getItem('cod_bod_transfer_d'),
      usercla   : sessionStorage.getItem('Token-User'),
      referencia: '',
      tipoCosto : sessionStorage.getItem('tipo_costo'),
      comenta   : a
    }

    console.log(modelCab);
    
    if( this.cantSprod <= 0 ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Necesitas por lo menos un producto ingresado en el detalle.',
      })
    }
    else {
      this._bodserB     = '';
      this._cod         = '';
      this._desc        = '';
      this._pres        = '';
      this._cnti        = '';

      this._boolTableShow = false;
      this.boolBodOri     = true;
      this._bodserBool    = false;

      this.gpbod( '0', this.modifyDate() )

      this.gb.saveCab(modelCab).subscribe( () => {
        
        Swal.fire({
          icon:  'success',
          title: 'Bien!',
          text:  'se ha transferido con éxito',
        })
        
      }, () => {
        
        Swal.fire({
          icon:  'error',
          title: 'Oops...',
          text:  'Algo ocurrió.',
        })
        
      })
      for( let n = 0; n < this.arrGenTransProd.length; n++ ){

        let modelDetail = {          
          T_llave  : sessionStorage.getItem('Session-Key'),
          tempo    : 'transferencia',
          linea    : this.count ++,
          no_parte : this.arrGenTransProd[n].codigo,
          cantidad : this.arrGenTransProd[n].cantidad,
          precio_u : 0.00,
          precio_t : 0.00
        }
        this.saveDetalle(modelDetail);      
      }   
      console.log(sessionStorage.getItem('Session-Key'))      
      this.reporteria();
    }
  }

  public ArrSP_GRAFICAWEB: any = [];
  public bodegaGraph;
  public stock;

  graphicrep() {
    am4core.useTheme(am4themes_animated);
    let idchart = document.getElementById('chartdiv');
    // console.log(idchart);   
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // 
    let data = [];

    this.gb.getGraphicGen().subscribe( graph => {
      this.ArrSP_GRAFICAWEB = graph;

      for (let i = 0; i <= this.ArrSP_GRAFICAWEB.length - 1; i++) {

        this.bodegaGraph = this.ArrSP_GRAFICAWEB[i].bodega;
        this.stock       = this.ArrSP_GRAFICAWEB[i].stock;

        data.push({
          country: this.bodegaGraph,
          visits: this.stock
        })

        console.log(data);      
      
      }

      chart.data = data;
    
    })  

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = -2000;
    valueAxis.max = 24000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 15;
    // valueAxis.fill = '#fff';
    // axis break
    var axisBreak = valueAxis.axisBreaks.create();
    axisBreak.startValue = 2100;
    axisBreak.endValue = 30000;
    axisBreak.breakSize = 0.012;

    // make break expand on hover
    var hoverState = axisBreak.states.create("hover");
    hoverState.properties.breakSize           = 1;
    hoverState.properties.opacity             = 0.1;
    hoverState.transitionDuration             = 1500;
    axisBreak.defaultState.transitionDuration = 1000;

    
    //this is exactly the same, but with events
    axisBreak.events.on("over", () => {
      axisBreak.animate(
        [{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }],
        1500,
        am4core.ease.sinOut
      );
    });
    axisBreak.events.on("out", () => {
      axisBreak.animate(
        [{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }],
        1000,
        am4core.ease.quadOut
      );
    });

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX           = "country";
    series.dataFields.valueY              = "visits";
    series.columns.template.tooltipText   = "Stock: {valueY.value}";
    series.columns.template.tooltipY      = 0;
    series.columns.template.strokeOpacity = 0;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

  }


  reporteria() {
    let sliA, sliB;
      
    setTimeout(() => {
      this.gb.exec( sessionStorage.getItem('Session-Key'), 'transferencia' ).subscribe( CODREPORT => {
        this.comproba = CODREPORT[0].comproba;
        sliA = this.comproba.slice(0,-8);
        sliB = this.comproba.slice(2,10);
      })
    }, 1000);
        
    setTimeout( () => {      
      this.report.getExecReport(sliA, sliB).subscribe( myreport =>{
        this.repoArr = myreport;
        this.repoBool = true;
        console.log(this.repoArr),
        this.bod_ori      = this.repoArr[0].bodega   + ' / ' + this.repoArr[0].bnombre;
        this.bod_desti    = this.repoArr[0].bodega_d + ' / ' + this.repoArr[0].bnombreD;
        this.fech_emi     = new Date();
        this.us_cla       = this.repoArr[0].usercla;
        this._observerrep = this.repoArr[0].comenta;
        this._numero      = this.repoArr[0].numero2;
        this._tipoTran    = this.repoArr[0].tipo;
        this.fech_tran    = this.repoArr[0].fecha_tra;
      })
    }, 2000)
  }


  saveDetalle(modelDetail) {   
      this.gb.saveDet(modelDetail).subscribe( () => {
        this.getTransProd();
      }, () => {
        console.log('ups algo ha ocurrido siguele ya mismo lo consigues');
      })
  }


  getTransacs() {

    this.gb.getTransacProd().subscribe( TRANS => {
      this.arrTransac = TRANS ;
      console.log(TRANS);
    })

  }

  gTrans(a, b) {

    this._transaccion = a;
    this.codTransac = b;
    sessionStorage.setItem('tipos-trans', this.codTransac);

  }

  gBodegas(filter) {
    this.gb.getBodegas(filter).subscribe( bodegas => {
      this.arrBodegas = bodegas;
    })
  }

  getCodecBodegaA( a, b ): string {
    this._bodser = a + ' / ' + b;
    this.x = a;
    this.boolBodegas = false;
    localStorage.setItem('BodegaIngreso', this._bodser);
    sessionStorage.setItem('cod_bod_transfer', a);
    return this._bodser;
  }

  getCodecBodegaB( a, b ): string {
    this._bodserB = a + ' / ' + b;
    this.boolBodegasB = false;
    localStorage.setItem('BodegaSalida', this._bodserB);
    sessionStorage.setItem('cod_bod_transfer_d', a);
    // console.log(sessionStorage.getItem('cod_bod_transfer_d'))
    return this._bodserB;
  }

  controlBodRep(){
    if( localStorage.getItem('BodegaIngreso') != localStorage.getItem('BodegaSalida') ) {
      return
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No puedes seleccionar las mismas bodegas al mismo tiempo',
      })

      this._bodser  = '------';
      this._bodserB = '------';



    }
  }

  comprobateBodega() {

    if( (this._bodser == undefined || this._bodserB == undefined) || (this._bodser == '------' || this._bodserB == '------' ) || ( this._transaccion == undefined ) ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: 'Estos 3 Campos deben estar llenos: <br> '+ 'Transacción <br>' + 'Bodega de Entrada <br>' + 'Bodega de Salida'
      })
    }

    else {
      this._boolTableShow =  true;
      this._bodserBool    =  true;
      this.boolBodOri     = false;
    }

  }
  public cantProdBod: number = 0;
  gpbod( bodega, date ) {
    this.gb.getProdBod( bodega, date ).subscribe( pbod => {
      this.prodBodArr = pbod;
      console.log(this.prodBodArr);
      this.cantProdBod = this.prodBodArr.length;
      if( this.prodBodArr.length == 0 ) {

        Swal.fire({
          icon: 'info',
          title: 'No tienes productos cargados en esta bodega'
        })

      }

    }, () => {
      // alert('Algo ha ocurrido!');
    })

  }

  modifyDate() {
    let date = new Date();
    let formatingStringConverter = date.toString();
    let formatingSlice = formatingStringConverter.slice(4,-36);
    let formatingReplace = formatingSlice.replace(/ /g, "-");
    return formatingReplace;
  }

  searchProd( a ) {
    this.gpbod(a, this.modifyDate());
  }

  getCodec() {
    this._boolLift = true;
    this._codProd = this.x;
  }

  //_boolTableShow = !_boolTableShow
  activateBodIngreso() {
    if( this.arrGenTransProd.length > 0 ) {
      Swal.fire({
        icon: 'error',
        title: 'Debes terminar la transacción!',
        text: ''
      })
    }
    else {
      this._boolTableShow = false;
      // this._boolLift = false;
      this.boolBodOri = true;
      this._bodserBool = false;
    }
  }

  getReport() {
    this.reporteria()
  }

  upProduct(a, b, c ,d) {
    
    if( d <= 0 ) {
      Swal.fire({
        icon: 'info', title: 'Oops..!', text: 'No puedes escojer un producto sin stock'
      })
    }
    else {

      localStorage.setItem('no_parte-trans',      a);
      localStorage.setItem('nombre-trans',        b);
      localStorage.setItem('presentacion-trans',  c);
      localStorage.setItem('stock-trans',         d);

      this._cod   = a;
      this._desc  = b;
      this._pres  = c;
      this._STCK = localStorage.getItem('stock-trans');
      //this._cant  = d;
    }
  }


  public calc: number;
  validateCantidad(a) {

    if(this._cnti <= localStorage.getItem('stock-trans')) {
      localStorage.setItem('cant-transfer', a);
      this.calc =  Number(localStorage.getItem('stock-trans')) - Number(localStorage.getItem('cant-transfer'));
      localStorage.setItem('difer-stock', this.calc.toString());
    }

    else if( this._cnti > localStorage.getItem('stock-trans')) {

      Swal.fire({
        icon: 'info', title: 'LLegaste al límite'
      })

      this._cnti = localStorage.getItem('stock-trans');
      localStorage.setItem('cant-transfer', localStorage.getItem('stock-trans'));

    }
    
    
    
  }
  
  
  public arrProd: any = [];
  validateNegative(id, opt ) {   
    
    
    if (Number(localStorage.getItem('stock-trans')) < 0) {

      Swal.fire({
        icon: 'error',
        title: 'No podemos agregar este producto al detalle, con stock negativo'
      })

    }

    else if ( this._cnti <= 0 ) {
      Swal.fire({
        icon: 'error', title: 'Oops!', text: 'Debes ingresar cantidad mayor a 0'
      })

      this._cnti = 0;
      
    }

    else if(( this._cod == undefined  || this._cod == '' )  ||
            ( this._desc == undefined || this._desc == '')  ||
            ( this._pres == undefined || this._pres == ''))
    {

      Swal.fire({
        icon: 'error',
        title: 'No podemos agregar este producto al detalle, tienes campos vacíos'
      })

    }

    else {
      switch(opt) {
        case 'a':
          this.postTransProd();
          break;
        case 'b':
          this.updateTransProd(id);
          break;
        } 
        
      }
      
    }
    
  public boolUp: boolean = false;
  public IDUP:   number;
  getNewCant(a,b) {
    this.boolUp = true;
    this.codigo = a;
    this.IDUP = b;
    localStorage.setItem('id-transfer', this.IDUP.toString() );
  }
    
  updateTransProd(id) {

    this.modelTPtod = {
      id: id,
      bodega_ing:   this.x,
      codigo:       this._cod ,
      descripcion:  this._desc,
      presentacion: this._pres,
      difer_stcok:  this.calc,
      stock:        Number(localStorage.getItem('stock-trans')),
      cantidad:     this._cnti
    }

    this.gb.updateProdBod(id, this.modelTPtod).subscribe( update => {
      console.log( update );

      Swal.fire({
        icon:  'success',
        title: 'Editado!',
        text:  'La cantidad se ha editado con éxito'
      })

      this.getTransProd();

    }, () => {
      Swal.fire({
        icon: 'error',
        title: 'Opps!',
        text: 'La cantidad no se ha editado con éxito'
      })
    })

  }
  diferStockCal(a,b): number {
    let calc = a - b;
    return calc;
  }

  public modelTPtod:any = [];

  postTransProd() {

    this.modelTPtod = {
      bodega_ing:   this.x,
      codigo:       this._cod ,
      descripcion:  this._desc,
      presentacion: this._pres,
      difer_stcok:  this.calc,
      stock:        Number(localStorage.getItem('stock-trans')),
      cantidad:     this._cnti
    }

    // console.log(this.modelTPtod);

    this.gb.saveProdBod(this.modelTPtod).subscribe( sprod => {
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Generado!',
      // })

      // console.log('==========HTTP RESPONSE==========');
      // console.log(sprod);
      // console.log(this.calc);
      this.getTransProd();
    }, err => { 
      Swal.fire({
        icon: 'info',
        title: 'Este producto ya fue agregado',
      })
     })

  }

  delTransProd(id) {
    this.gb.delProdBod(id).subscribe( del => {
      
      Swal.fire({
        icon: 'success',
        title: 'Eliminado!',
        text: 'Este producto se ha eliminado con éxito'
      })

      this.getTransProd();
    
    })
  }

  public arrGenTransProd: any = [];
  public cantSprod: number;

  getTransProd() {
    this.gb.genProdBod().subscribe( x => {
      this.arrGenTransProd = x;
      // console.log('QUIERO VER EL STOCK');
      console.log(this.arrGenTransProd);
      this.cantSprod = this.arrGenTransProd.length;    
    })
  }

}
