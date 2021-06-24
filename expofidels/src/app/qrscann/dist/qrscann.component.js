"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QrscannComponent = void 0;
var core_1 = require("@angular/core");
var angular2_qrscanner_1 = require("angular2-qrscanner");
var sweetalert2_1 = require("sweetalert2");
var QrscannComponent = /** @class */ (function () {
    function QrscannComponent(iDB) {
        this.iDB = iDB;
        this.arrNum = [];
        this.contador = 0;
        this.camCont = true;
        this.camera = 'Front';
        this.codPRODS = '---';
        this.devices = [];
        this.arrJornDataUnit = [];
        this.pLabores = false;
        this.pIngresado = false;
        this.scannerQR = false;
    }
    QrscannComponent.prototype.ngOnInit = function () {
        // localStorage.removeItem('cp');
    };
    QrscannComponent.prototype.ngAfterViewInit = function () {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        this.cameraControl(this.camera);
    };
    QrscannComponent.prototype.cameraControl = function (a) {
        var _this = this;
        this.qrScannerComponent.getMediaDevices().then(function (devices) {
            //console.log(devices);
            var videoDevices = [];
            for (var _i = 0, devices_1 = devices; _i < devices_1.length; _i++) {
                var device = devices_1[_i];
                if (device.kind.toString() === 'videoinput') {
                    videoDevices.push(device);
                    _this.devices = videoDevices;
                }
            }
            if (videoDevices.length >= 0) {
                var choosenDev = void 0;
                for (var _a = 0, videoDevices_1 = videoDevices; _a < videoDevices_1.length; _a++) {
                    var dev = videoDevices_1[_a];
                    if (dev.label.includes(a)) {
                        choosenDev = dev;
                        _this.messageCam = 'Si tiene camara posterior';
                        break;
                    }
                    else {
                        choosenDev = dev;
                        _this.messageCam = 'No tiene camara posterior';
                    }
                }
                if (choosenDev) {
                    _this.qrScannerComponent.chooseCamera.next(choosenDev);
                }
                else {
                    _this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
                }
            }
        });
        this.qrScannerComponent.capturedQr.subscribe(function (result) {
            var regex = /(\d+)/g;
            document.getElementsByTagName('video')[0].style.display = 'none';
            _this.codPRODS = result;
            console.log(result);
            var sliceResult = _this.codPRODS.slice(5, 20);
            _this.sliceNum = sliceResult.match(regex);
            localStorage.setItem('cod_prod', _this.sliceNum.toString());
            _this.arrNum = {
                num: _this.sliceNum.toString()
            };
            _this.iDB.createIndexedDB('scanDB', 1);
            _this.iDB.saveDataIndexedDB('scanDB', 1, _this.arrNum);
            if (_this.sliceNum.toString() != localStorage.getItem('no_parte')) {
                _this.iDB.elBDData('scanDB');
                console.log('[CODIGO] Es diferente: ' + _this.sliceNum.toString()
                    + ' ' + localStorage.getItem('no_parte'));
                sweetalert2_1["default"].fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, reiniciar!'
                }).then(function (result) {
                    localStorage.removeItem('scann_number');
                    localStorage.setItem('scann_number', '0');
                    // this.reiniciarQR();
                    if (result.isConfirmed) {
                        sweetalert2_1["default"].fire('Reseteado!', 'Valor de scaneo reiniciado.', 'success');
                    }
                });
            }
            else {
                console.log('[CODIGO] Es igual: ' +
                    _this.sliceNum.toString() + ' ' +
                    localStorage.getItem('cod_prod'));
            }
        });
    };
    QrscannComponent.prototype.reiniciarQR = function () {
        window.location.reload();
    };
    QrscannComponent.prototype.changeCamera = function () {
        switch (this.camCont) {
            case true:
                this.camCont = false;
                this.cameraControl('front');
                console.log(this.camCont);
                console.log('front');
                break;
            case false:
                this.cameraControl('back');
                this.camCont = true;
                console.log('back');
                console.log(this.camCont);
                break;
            default:
                this.cameraControl('back');
                break;
        }
    };
    __decorate([
        core_1.ViewChild(angular2_qrscanner_1.QrScannerComponent, { static: false })
    ], QrscannComponent.prototype, "qrScannerComponent");
    QrscannComponent = __decorate([
        core_1.Component({
            selector: 'app-qrscann',
            templateUrl: './qrscann.component.html',
            styleUrls: ['./qrscann.component.styl']
        })
    ], QrscannComponent);
    return QrscannComponent;
}());
exports.QrscannComponent = QrscannComponent;
