import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { IndexedDBService } from '../services/indexed-db.service';

@Component({
  selector: 'app-qrscann',
  templateUrl: './qrscann.component.html',
  styleUrls: ['./qrscann.component.styl']
})
export class QrscannComponent implements OnInit {
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

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent;

  constructor( public iDB: IndexedDBService ) { }
  
  ngOnInit() {
    // localStorage.removeItem('cp');
  }

  ngAfterViewInit(): void {

    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.cameraControl(this.camera);

  }
  
  cameraControl(a) {

    this.qrScannerComponent.getMediaDevices().then(devices => {
      //console.log(devices);
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
      document.getElementsByTagName('video')[0].style.display = 'none';
      this.codPRODS = result;
      
      
      let sliceResult = this.codPRODS.slice(5,20);
      this.sliceNum = sliceResult.match(regex);
      localStorage.setItem('cod_prod', this.sliceNum.toString());
      
      this.arrNum = {
        num: this.sliceNum.toString()
      }
      
      this.iDB.createIndexedDB('scanDB', 1);
      this.iDB.saveDataIndexedDB('scanDB', 1, this.arrNum);
      
      if (this.sliceNum.toString() != localStorage.getItem('no_parte'))  {        
        
        this.iDB.elBDData('scanDB');
        console.log('[CODIGO] Es diferente: ' + 
                     this.sliceNum.toString() + ' ' +
                     localStorage.getItem('no_parte'));
                     localStorage.removeItem('scann_number');
                     localStorage.setItem('scann_number', '0');
                     this.reiniciarQR();
      }
      
      else {
        console.log('[CODIGO] Es igual: ' +
                    this.sliceNum.toString() + ' ' +
                    localStorage.getItem('cod_prod'));
      }

    });

  }

  reiniciarQR() {
    window.location.reload();
  }

  
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

}
