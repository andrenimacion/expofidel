import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { ControlloteService } from '../services/controllote.service';
import Swal from 'sweetalert2';
import { A } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-controlempaque',
  templateUrl: './controlempaque.component.html',
  styleUrls: ['./controlempaque.component.styl']
})

export class ControlempaqueComponent implements OnInit {

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
  public nombre;
  public cedula;
  public hora;
  public pLabores   = false;
  public pIngresado = false;
  public scannerQR  = false;
  public difer: any;
  public Numpost;
  /*QR VARS FIN */

  public count_click = 0;

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent;

  constructor( public lote:ControlloteService ) { }

  count_click_add() {
    
    this.count_click += 1;
    localStorage.setItem('pistolNumber', this.count_click.toString());
    this._pistoleada = this.count_click;
    console.log(this.count_click);

  }

  ngOnInit() {
    this.filterLote(this._lote, this.topLote);
  }


  activeSound() {
    const a = <HTMLAudioElement> document.getElementById('soundQR');
    a.play();
    console.log('funcion sonido se esta activando');
  }

  ngAfterViewInit(): void {
    this.cameraControl(this.camera);
  }

  cameraControl(a) {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      // console.log(devices);
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
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: `${this.messageCam}`,
                  showConfirmButton: false,
                  timer: 1500
                })
                this.messageCam = 'No tiene camara posterior';
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
    document.getElementsByTagName('video')[0].controls = true;
    this.codPRODS = result;
    this.activeSound();
    // var count = 0
    // console.log( count++ );
    console.log(result);
      this.count_click_add()
      let sliceResult = this.codPRODS.slice(5,20);
      this.sliceNum = sliceResult.match(regex);
      localStorage.setItem('cod_prod_lote', this.sliceNum.toString());
      
      this.arrNum = {
        num: this.sliceNum.toString()
      }

     }
    );
  }

  reiniciarQR = () =>  window.location.reload();

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

  filterLote(lote, top) {
    this.lote.getLoteFilter(lote, top).subscribe( l => {
      this.loteArr = l;
      console.log(this.loteArr);
    })
  }

  public _canti;
  getLote(l, j, c) {
    console.log(l)
    localStorage.setItem('LoteSelect', l);
    localStorage.setItem('Lote', j);
    this.getimgnparte(l);
    this._canti = c;
    this._lote = j;
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

    // console.log(this.arrLFoto);
    this.lote.upimg( localStorage.getItem('LoteSelect'), this.arrLFoto ).subscribe( upf=> {
       console.log(upf);
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
