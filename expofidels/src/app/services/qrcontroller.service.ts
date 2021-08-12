import { Injectable, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

@Injectable({
  providedIn: 'root'
})
export class QrcontrollerService {
  public resGen;
  public count_click;
  public devices;
  public messageCam;

  @ViewChild(QrScannerComponent, { static : false }) 
             qrScannerComponent: QrScannerComponent;

  constructor() { }

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
          // document.getElementsByTagName('video')[0].style.display = 'none';
          // document.getElementsByTagName('video')[0].controls      = false;
          this.resGen = result;    
          console.log(this.resGen);    
          // this.lote.getloteFilterExec(this.resGen, 1).subscribe( execlote => {
          // this.resLote = execlote[0].resultado;
          // this.loteEstado('E', localStorage.getItem( 'comprobante-tipo' ),
          //                      localStorage.getItem( 'comprobante-numero' ))
        })

        // this.lote.getloteFilterExec( this.resGen, 2 ).subscribe( execprod => {
        //   this.resCPro = execprod[0].resultado;
        // })

        // setTimeout(() => {
        //   // console.log('Ejecutando filterLote')
        //   // console.log(this.resLote + ' / ' + this.resCPro);
        //   //this.topLote = 1;
        //   //this.filterLote(this.resLote, this.resCPro, this.topLote);
        // },1000 )

        //this.filterLote( this.strLote(this.resGen), this.strNparte(this.resGen), 1 );
        // localStorage.setItem('Result-scann-codec', this.codPRODS);
        //this.controlLoteDifer(localStorage.getItem('Result-scann-codec'));

        this.activeSound();
        //this.count_click_add();
        // this.loteEstado('T', localStorage.getItem('comprobante-tipo'),
        //                  localStorage.getItem('comprobante-numero'));
        // this.difer = Number(localStorage.getItem('Cantidad')) - Number(localStorage.getItem('pistolNumber'));                
        // let canthalf = Number(localStorage.getItem('Cantidad')) / 2;

      //   if( this.difer <= 0 ) {

      //     this.difer = 0;
      //       const Toast = Swal.mixin({
      //         toast: true,
      //         position: 'center',
      //         showConfirmButton: false,
      //         timer: 3000,
      //         timerProgressBar: true,

      //         didOpen: (toast) => {
      //           toast.addEventListener('mouseenter', Swal.stopTimer);
      //           toast.addEventListener('mouseleave', Swal.resumeTimer);             
      //         }

      //       })

      //       Toast.fire({
      //         icon: 'success',
      //         title: `Haz culminado con éxito ${localStorage.getItem('Lote')} `
      //       })


      //   }
        
      //   let sliceResult = this.codPRODS.slice(5,20);
      //   this.sliceNum = sliceResult.match(regex);
      //   localStorage.setItem('cod_prod_lote', this.sliceNum.toString());
      //   this.arrNum = {
      //     num: this.sliceNum.toString()
      //   }

      // }
      // );

  }
  
  activeSound() {
    const a = <HTMLAudioElement> document.getElementById('soundQR');
    a.play();
  }
  public _pistoleada;
  count_click_add() {        
    this.count_click += 50;
    localStorage.setItem('pistolNumber', this.count_click.toString());    
    this._pistoleada = this.count_click;
    // console.log(this.count_click);
  }

}
