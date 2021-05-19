import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-qrscann',
  templateUrl: './qrscann.component.html',
  styleUrls: ['./qrscann.component.styl']
})
export class QrscannComponent implements OnInit {

  public camCont: boolean = true;
  public camera: string = 'Front';
  public codJor: string = '---';
  public devices: any = [];
  public messageCam: string;
  public arrJornDataUnit: any = [];
  public nombre;
  public cedula;
  public hora;
  public pLabores   = false;
  public pIngresado = false;
  public scannerQR  = false;

  @ViewChild(QrScannerComponent, { static : false }) qrScannerComponent: QrScannerComponent ;


    constructor(  ) {

    }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    this.cameraControl(this.camera)

  }

  cameraControl(a) {
    this.qrScannerComponent.getMediaDevices().then(devices => {

      //console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];

      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
              // console.log(videoDevices);
              this.devices = videoDevices;
          }
      }

      if (videoDevices.length >= 0) {
        console.log(videoDevices.length)
          let choosenDev;

          //console.log(videoDevices);

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

      document.getElementsByTagName('video')[0].style.display = 'none';
      this.codJor = result;
      localStorage.setItem('codJor', this.codJor);
      // this.getJornData(this.codJor);

    });

  }

  reiniciarQR() {
    window.location.reload();
  }    

changeCamera() {
  // this.cameraControl();
  //console.log(this.camera);
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
