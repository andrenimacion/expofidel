import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { ControlloteService } from '../services/controllote.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { A, B } from '@angular/cdk/keycodes';
import { number } from '@amcharts/amcharts4/core';
import { TransaccionService } from '../services/transaccion.service';
import { TipoControlEmpService } from '../services/tipo-control-emp.service';
import { TInvcabgControllerService } from '../services/t-invcabg-controller.service';

@Component({
  selector: 'app-controlempaque',
  templateUrl: './controlempaque.component.html',
  styleUrls: ['./controlempaque.component.styl']
})

export class ControlempaqueComponent implements OnInit {
  
  public _cliente;
  public _direccion;
  public _bodega;
  public _concepto;

  public _ruc;
  public _telefono;
  public _emision;
  public _f_vencimiento;

  public _dateNow = new Date();

  //foter INICIO
  public _footer = `POFIDEL - `;
  //foter FIN

  //var report INICIO
  public _reportBool: boolean = false;
  //var report FIN

  public _canti:number = 0;
  public bolup: boolean = false;

  public _lote: string = '0';
  public _QRBool: boolean = false;
  public loteArr: any = [];
  public _pistoleada: number = 0;
  public topLote: number = 50;
  public _IMGE: any;
  
  /*QR VARS INICIO */
  public codProd:string ;
  public arrNum: any = [];
  public contador: number = 0;
  public sliceNum: any;
  public camCont: boolean = true;
  public camera: string = 'Front';
  public codPRODS: string = '---';
  public devices: any = [];
  public messageCam: string;
  public arrJornDataUnit: any = [];
  public difer: number;
  public Numpost;
  /*QR VARS FIN */  
  
  public _QrVisor: boolean = true;
  public _TableVisor: boolean = true;
  
  public count_click = 0;
  public _imgVisor: boolean = false;
  
  public cantLote: number = 50;
  
  public compSliceA: string;
  public compSliceB: string;

  @ViewChild(QrScannerComponent, { static : false }) 
             qrScannerComponent: QrScannerComponent;

  constructor( public  gContEmp:           TInvcabgControllerService,
               private controlType:        TipoControlEmpService,
               public  lote:               ControlloteService,
               private transaccionService: TransaccionService) { }
  
  ngOnInit() {
    this.filterLote('0', '0', this.cantLote);
  }
  
  public gt: any = [];
  public types;
  gTypes(a) {
    this.controlType.getTypes().subscribe(
      x => {
        this.gt = x;
        
        const btnAjust = <HTMLButtonElement> document.getElementById('ajusteButton');

        if(a < 0) {
          this.types = this.gt[1].tipo;
          this.estateConsumo = this.gt[1].consumo;
          btnAjust.disabled = false; 
          //console.log(this.estateConsumo);
        }
        else if (a > 0) {
          btnAjust.disabled = false; 
          this.types = this.gt[0].tipo;
          this.estateConsumo = this.gt[0].consumo;
          //console.log(this.estateConsumo);
        }

        else if ( a == 0 ) {
          btnAjust.disabled = false; 
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Estás seguro?',
            text: "¿La cantidad ingresada es la correcta?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, empacar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                'Empacado!',
                'El empaque fue ejcutado con éxito',
                'success'
              )

              this.loteEstado('T', this.compSliceA, this.compSliceB);

              this._lote    = '---';
              this._canti   = 0;
              this._escane  = 0;
              this.difer    = 0;
              this.filterLote('0','0', 50);

            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
              ) {
                swalWithBootstrapButtons.fire(
                  'Cancelado',
                  'El empacado fue cancelado',
                  'error'
                  )

                  this.filterLote('0','0', 50);
                  this._lote   = '---';
                  this._canti  = 0;
                  this._escane = 0;
                  this.difer   = 0;

                }
               
          })



        }
    })
  }
  
  count_click_add() {        
    this.count_click += 50;
    localStorage.setItem('pistolNumber', this.count_click.toString());    
    this._pistoleada = this.count_click;
    // console.log(this.count_click);
  }

  imprSelec(a) {
    var ficha = document.getElementById(a);
    ficha.style.fontFamily = 'arial';
	  let ventimp = window.open(' ', 'popimpr');    
	  ventimp.document.write( ficha.innerHTML);
	  ventimp.document.close();
    ventimp.print();    
    ventimp.close();
	}

  ngAfterViewInit(): void {
    this.cameraControl(this.camera);
  }

  visorController(a, b) {    
    if( !this._QrVisor ) {
      location.reload();
    }

    this._QrVisor   = a;
    this._imgVisor  = b;
    this.bolup      = b;
  }

  activeSound() {
    const a = <HTMLAudioElement> document.getElementById('soundQR');
    a.play();
  }

  public sliceResult: string;
  public resLote: string;
  public resCPro;
  public resGen;
  cameraControl(a) {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
              this.devices = videoDevices;
          }
      }
      if (videoDevices.length >= 0) {
        
        let choosenDev;
        for (const dev of videoDevices) {

              if (dev.label.includes(a)) {
                  choosenDev = dev;
                  this.messageCam = 'Si tiene camara posterior';
                  break;
              }

              else {
                choosenDev = dev;
              }
          }

          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          }

          else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }

      }
    });
 

    this.qrScannerComponent.capturedQr.subscribe( result => {           
        
        var regex = /(\d+)/g;
          document.getElementsByTagName('video')[0].style.display = 'none';
          document.getElementsByTagName('video')[0].controls      = false;
          this.resGen = result;    
          console.log(this.resGen);    
          this.lote.getloteFilterExec(this.resGen, 1).subscribe( execlote => {
          this.resLote = execlote[0].resultado;
          this.loteEstado('E', localStorage.getItem( 'comprobante-tipo' ),
                               localStorage.getItem( 'comprobante-numero' ))
        })

        this.lote.getloteFilterExec( this.resGen, 2 ).subscribe( execprod => {
          this.resCPro = execprod[0].resultado;
        })

        setTimeout(() => {
          // console.log('Ejecutando filterLote')
          // console.log(this.resLote + ' / ' + this.resCPro);
          this.topLote = 1;
          this.filterLote(this.resLote, this.resCPro, this.topLote);
        },1000 )

        //this.filterLote( this.strLote(this.resGen), this.strNparte(this.resGen), 1 );
        localStorage.setItem('Result-scann-codec', this.codPRODS);
        //this.controlLoteDifer(localStorage.getItem('Result-scann-codec'));

        this.activeSound();
        this.count_click_add();
        // this.loteEstado('T', localStorage.getItem('comprobante-tipo'),
        //                  localStorage.getItem('comprobante-numero'));
        this.difer = Number(localStorage.getItem('Cantidad')) - Number(localStorage.getItem('pistolNumber'));                
        let canthalf = Number(localStorage.getItem('Cantidad')) / 2;

        if( this.difer <= 0 ) {

          this.difer = 0;
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,

              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);             
              }

            })

            Toast.fire({
              icon: 'success',
              title: `Haz culminado con éxito ${localStorage.getItem('Lote')} `
            })


        }
        
        let sliceResult = this.codPRODS.slice(5,20);
        this.sliceNum = sliceResult.match(regex);
        localStorage.setItem('cod_prod_lote', this.sliceNum.toString());
        this.arrNum = {
          num: this.sliceNum.toString()
        }

      }
      );

  }  

  showReport(a,b,c) {
    const observable = new Observable(function subscribe(subscriber) {
      subscriber.next(a);
      subscriber.next(b);
      subscriber.next(c);
      subscriber.complete();
    });

    observable.subscribe( x => console.log(x) );

  }

  controlLoteDifer(b) {

    if (this._lote != b) {
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No podemos proceder por que el código QR es diferente al Lote seleccionado',
        footer: 'Selecciona el lote correspondiente al código QR o viceversa.'
      })

    }

  }

  reiniciarQR = () =>  location.reload();

  changeCamera() {
    switch(this.camCont) {
      case true:
        this.camCont = false;
        this.cameraControl('front');
        console.log(this.camCont)
        console.log('front')
        break;
      case false:
        this.cameraControl('back');
        this.camCont = true;
        console.log('back')
        console.log(this.camCont)
        break;
      default:
        this.cameraControl('back');
        break;
    }
  }

  public _escane = 0;
  public cantLoteB: number;
  filterLote(lote, npart, top) {
      this.lote.getLoteFilter(lote, npart, top).subscribe( l => {
        this.loteArr = l;
        this.cantLote = this.loteArr.length;
        this._lote = this.loteArr[0].lote;
        this._canti = this.loteArr[0].cantidad;
        this.cantLoteB = this.loteArr[0].cantidad_item;
        localStorage.setItem('Cantidad', this.loteArr[0].cantidad);  
        localStorage.setItem('BODEGA-SCANN',  this.loteArr[0].bodega);
        localStorage.setItem('COMPROBA-SCANN',  this.loteArr[0].comproba);
        localStorage.setItem('NO_PARTE-SCANN',  this.loteArr[0].no_parte);
        console.log(this.loteArr[0].bodega)
        localStorage.setItem('Lote', this.loteArr[0].lote);
        console.log('---LOTEARR---');
        console.log(this.loteArr);
        return this.loteArr;
      })
  }

  public arrEstate: any = [];
  loteEstado(estadolote, tipo, numero) {
    this.lote.updateEstate(estadolote, tipo, numero)
             .subscribe( x => {
                this.arrEstate = x; 
                console.log(this.arrEstate);
                console.log('este es el estado: ' + estadolote)
                this.filterLote(localStorage.getItem('LoteSelect'), '0', 1);
              

              
              })
  }  

  getLote(l, j, c, comprobante) {

    localStorage.setItem('LoteSelect', l);
    localStorage.setItem('Lote', j);
    localStorage.setItem('Cantidad', c);

    this.getimgnparte(l);
    this._canti = c;
    this._lote = j;
    this.compSliceA = comprobante.slice(0, -8);
    this.compSliceB = comprobante.slice(2);
    localStorage.setItem('comprobante-tipo',   this.compSliceA);
    localStorage.setItem('comprobante-numero', this.compSliceB);   
    

  }

  public estateConsumo;
  operLote(a, b) {
    this.difer = a - b; 
    this.gTypes(this.difer);
  }

  encodeImageFileAsURL() {
    const filesSelected = document.getElementById('fileUp') as HTMLInputElement;
    const fileId = filesSelected.files;

    let base;
    if (fileId.length > 0) {
      const fileToLoad = filesSelected[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        base = fileReader.result;
        document.getElementById('imgTest').style.backgroundImage = `url(${base})`;
      };
      fileReader.onloadend = () => {
        this._IMGE = fileReader.result;
        console.log(this._IMGE);
      };

      const a = fileReader.readAsDataURL(fileId[0]);
    
    }

  }

  public arrAs:any = [];
  public _n_reporte;
  public numeracion;
  adjustmentAuto() {
    this.transaccionService.cab( sessionStorage.getItem('Session-Key'), 'ajuste',
                                 this.types, localStorage.getItem('BODEGA-SCANN'),
                                 sessionStorage.getItem('Token-User'), localStorage.getItem('COMPROBA-SCANN'),
                                 this.estateConsumo );

    this.transaccionService.detail(sessionStorage.getItem('Session-Key'), 
                                  'ajuste', 1, localStorage.getItem('NO_PARTE-SCANN'),
                                  this.difer);
  
    setTimeout(()=> {
      this.gContEmp.getExecControlEmpaque(sessionStorage.getItem('Session-Key'), 'ajuste')
                   .subscribe( m => {
        console.log(m)
        this.arrAs = m;
        this._reportBool = true;
        this._n_reporte = this.arrAs[0].tipo + this.arrAs[0].consumo;
        this._bodega = this.arrAs[0].bodega;
        this._concepto = this.arrAs[0].comenta;
        this._emision = this.arrAs[0].fecha_tra;
        this.numeracion = this.arrAs[0].numero;
      });
    }, 1200)
  }
  
  public arrLFoto: any = [];
  upFoto() {
    this.arrLFoto = {      
      no_parte_i:  localStorage.getItem('NO_PARTE-SCANN'),
      img_no_parte: this._IMGE
    }
    this.lote.upimg( localStorage.getItem('NO_PARTE-SCANN'), this.arrLFoto ).subscribe( upf=> {
       // console.log(upf);
       Swal.fire({
         icon: 'success',
         title: 'Bien!...',
         text: 'La imagen del producto se ha actualizado con éxito'
       })
    }, () => {
       Swal.fire({
         icon: 'error',
         title: 'Opps!...',
         text: 'Algo no ha salido bien revisa tu conexión...'
       })
    })
  }

  public nimgArr: any = [];
  getimgnparte(a) {
    this.lote.getimgbyNparte(a).subscribe( nimg => {
      this.nimgArr = nimg;
      this._IMGE = this.nimgArr[0].img_no_parte;
    })
  }



}
