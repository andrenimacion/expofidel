import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { ControlloteService } from '../services/controllote.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { A, B } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-controlempaque',
  templateUrl: './controlempaque.component.html',
  styleUrls: ['./controlempaque.component.styl']
})

export class ControlempaqueComponent implements OnInit {

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

  
  public _imgVisor: boolean = false;  
  public _QrVisor: boolean = true;
  public _TableVisor: boolean = true;

  public count_click = 0;

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent;

  constructor( public lote:ControlloteService ) { }

  
  ngOnInit() {
    
    this.difer = Number(localStorage.getItem('Cantidad')) - Number(localStorage.getItem('pistolNumber'));
    this.filterLote(this._lote, '0', this.topLote);
    this._canti = Number(localStorage.getItem('Cantidad'));    
    this._canti = 0;    
    if( this._canti == 0 ) {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Escoje un lote para empezar el escaneo',
        showConfirmButton: true,
        timer: 2500
      })      
    }    

  }
  
  count_click_add() {        
    this.count_click += 50;
    localStorage.setItem('pistolNumber', this.count_click.toString());    
    this._pistoleada = this.count_click;
    // console.log(this.count_click);
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
        document.getElementsByTagName('video')[0].style.display = '';
        document.getElementsByTagName('video')[0].controls      = true;
        this.resGen = result;
        console.log(this.resGen);
        


        this.lote.getloteFilterExec(this.resGen, 1).subscribe( execlote => {
          this.resLote = execlote[0].resultado;
        })

        this.lote.getloteFilterExec( this.resGen, 2 ).subscribe( execprod => {
          this.resCPro = execprod[0].resultado;
        })
        setTimeout(() => {
          console.log('Ejecutando filterLote')
          console.log(this.resLote + ' / ' + this.resCPro);
          this.filterLote(this.resLote, this.resCPro, 1);
        },1000 )

        //this.filterLote( this.strLote(this.resGen), this.strNparte(this.resGen), 1 );
        localStorage.setItem('Result-scann-codec', this.codPRODS);
        this.controlLoteDifer(localStorage.getItem('Result-scann-codec'));

        this.activeSound();
        this.count_click_add();
        this.loteEstado('T', localStorage.getItem('comprobante-tipo'),
                         localStorage.getItem('comprobante-numero'));
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

             //this.filterLote('0',  '0', this.topLote);

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

    // else {     

    // }

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
  filterLote(lote, npart, top) {
    this.lote.getLoteFilter(lote, npart, top).subscribe( l => {
      this.loteArr = l;
      this._lote = this.loteArr[0].lote;
      this._canti = this.loteArr[0].cantidad;
      localStorage.setItem('Cantidad', this.loteArr[0].cantidad);      
      localStorage.setItem('Lote', this.loteArr[0].lote);
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
                this.filterLote('0', '0', 50);
              })
  }  

  public _canti = 0;
  public compSliceA: string;
  public compSliceB: string;
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

    this.loteEstado('E', localStorage.getItem('comprobante-tipo'),
                         localStorage.getItem('comprobante-numero'));
    this.filterLote('0', '0', 50);
    
  }
  
  operLote(a,b) {
    this.difer = a - b
    console.log(this.difer);
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
  

  public arrLFoto: any = [];
  upFoto() {

    this.arrLFoto = {
      
      no_parte_i:  localStorage.getItem('LoteSelect'),
      img_no_parte: this._IMGE

    }

    this.lote.upimg( localStorage.getItem('LoteSelect'), this.arrLFoto ).subscribe( upf=> {
       // console.log(upf);
       Swal.fire({
         icon: 'success',
         title: 'Bien!...',
         text: 'La imagen del producto se ha actualizado con éxito'
       })
    }, err => {
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
