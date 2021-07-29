"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ControlempaqueComponent = void 0;
var core_1 = require("@angular/core");
var angular2_qrscanner_1 = require("angular2-qrscanner");
var sweetalert2_1 = require("sweetalert2");
var ControlempaqueComponent = /** @class */ (function () {
    function ControlempaqueComponent(lote) {
        this.lote = lote;
        this.bolup = false;
        this._lote = '0';
        this._QRBool = false;
        this.loteArr = [];
        this._pistoleada = 0;
        this.topLote = 50;
        this.arrNum = [];
        this.contador = 0;
        this.camCont = true;
        this.camera = 'Front';
        this.codPRODS = '---';
        this.devices = [];
        this.arrJornDataUnit = [];
        /*QR VARS FIN */
        this._imgVisor = false;
        this._QrVisor = true;
        this._TableVisor = false;
        this.count_click = 0;
        this.reiniciarQR = function () { return location.reload(); };
        this.arrEstate = [];
        this._canti = 0;
        this.arrLFoto = [];
        this.nimgArr = [];
    }
    ControlempaqueComponent.prototype.ngOnInit = function () {
        this.difer = Number(localStorage.getItem('Cantidad')) - Number(localStorage.getItem('pistolNumber'));
        this.filterLote(this._lote, this.topLote);
        this._canti = Number(localStorage.getItem('Cantidad'));
        this._canti = 0;
        if (this._canti == 0) {
            sweetalert2_1["default"].fire({
                position: 'center',
                icon: 'info',
                title: 'Escoje un lote para empezar el escaneo',
                showConfirmButton: true,
                timer: 2500
            });
        }
    };
    ControlempaqueComponent.prototype.count_click_add = function () {
        this.count_click += 50;
        localStorage.setItem('pistolNumber', this.count_click.toString());
        this._pistoleada = this.count_click;
        // console.log(this.count_click);
    };
    ControlempaqueComponent.prototype.ngAfterViewInit = function () {
        this.cameraControl(this.camera);
    };
    ControlempaqueComponent.prototype.visorController = function (a, b) {
        if (!this._QrVisor) {
            location.reload();
        }
        this._QrVisor = a;
        this._imgVisor = b;
        this.bolup = b;
    };
    ControlempaqueComponent.prototype.activeSound = function () {
        var a = document.getElementById('soundQR');
        a.play();
    };
    ControlempaqueComponent.prototype.cameraControl = function (a) {
        var _this = this;
        this.qrScannerComponent.getMediaDevices().then(function (devices) {
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
            document.getElementsByTagName('video')[0].style.display = '';
            document.getElementsByTagName('video')[0].controls = true;
            var PRODUCTION = function () {
                _this.lote.getloteFilterExec(result, 1).subscribe(function (execlote) {
                    _this.resLote = execlote[0].resultado;
                    _this._lote = _this.resLote;
                    console.log(_this._lote);
                });
                _this.lote.getloteFilterExec(result, 2).subscribe(function (execprod) {
                    _this.resCPro = execprod[0].resultado;
                    console.log(_this.resCPro);
                });
                setTimeout(function () {
                    _this.lote.getloteFilterNProd(_this._lote, _this.resCPro).subscribe(function (prod) {
                        console.log('///////////////////////////////');
                        console.log(prod);
                        console.log('///////////////////////////////');
                    }, function (err) {
                        console.log(err);
                        console.log('ALGO HA SALIDO MAL');
                    });
                }, 1000);
            };
            PRODUCTION();
            localStorage.setItem('Result-scann-codec', _this.codPRODS);
            _this.controlLoteDifer(localStorage.getItem('Result-scann-codec'));
            _this.activeSound();
            _this.count_click_add();
            _this.loteEstado('T', localStorage.getItem('comprobante-tipo'), localStorage.getItem('comprobante-numero'));
            _this.difer = Number(localStorage.getItem('Cantidad')) - Number(localStorage.getItem('pistolNumber'));
            var canthalf = Number(localStorage.getItem('Cantidad')) / 2;
            if (_this.difer <= 0) {
                _this.difer = 0;
                var Toast = sweetalert2_1["default"].mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: function (toast) {
                        toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                        toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
                    }
                });
                Toast.fire({
                    icon: 'success',
                    title: "Haz culminado con \u00E9xito " + localStorage.getItem('Lote') + " "
                });
                _this.filterLote('0', _this.topLote);
            }
            var sliceResult = _this.codPRODS.slice(5, 20);
            _this.sliceNum = sliceResult.match(regex);
            localStorage.setItem('cod_prod_lote', _this.sliceNum.toString());
            _this.arrNum = {
                num: _this.sliceNum.toString()
            };
        });
    };
    ControlempaqueComponent.prototype.showReport = function () {
    };
    ControlempaqueComponent.prototype.controlLoteDifer = function (b) {
        if (this._lote != b) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No podemos proceder por que el código QR es diferente al Lote seleccionado',
                footer: 'Selecciona el lote correspondiente al código QR o viceversa.'
            });
        }
        // else {     
        // }
    };
    ControlempaqueComponent.prototype.changeCamera = function () {
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
    ControlempaqueComponent.prototype.filterLote = function (lote, top) {
        var _this = this;
        this.lote.getLoteFilter(lote, top).subscribe(function (l) {
            _this.loteArr = l;
            // console.log('this.loteArr-------------INICIO');
            // console.log(this.loteArr);
            // console.log('this.loteArr-------------FIN');
            _this.difer = 0;
            // console.log(comprobante);
            //this.loteEstado('E', tipo, numero);
        });
    };
    ControlempaqueComponent.prototype.loteEstado = function (estadolote, tipo, numero) {
        var _this = this;
        this.lote.updateEstate(estadolote, tipo, numero).subscribe(function (x) {
            _this.arrEstate = x;
            console.log(_this.arrEstate);
            _this.filterLote('0', 50);
        });
    };
    ControlempaqueComponent.prototype.getLote = function (l, j, c, comprobante) {
        localStorage.setItem('LoteSelect', l);
        localStorage.setItem('Lote', j);
        localStorage.setItem('Cantidad', c);
        this.getimgnparte(l);
        this._canti = c;
        this._lote = j;
        this.compSliceA = comprobante.slice(0, -8);
        this.compSliceB = comprobante.slice(2);
        localStorage.setItem('comprobante-tipo', this.compSliceA);
        localStorage.setItem('comprobante-numero', this.compSliceB);
        this.loteEstado('E', localStorage.getItem('comprobante-tipo'), localStorage.getItem('comprobante-numero'));
        this.filterLote('0', 50);
    };
    ControlempaqueComponent.prototype.encodeImageFileAsURL = function () {
        var _this = this;
        var filesSelected = document.getElementById('fileUp');
        var fileId = filesSelected.files;
        var base;
        if (fileId.length > 0) {
            var fileToLoad = filesSelected[0];
            var fileReader_1 = new FileReader();
            fileReader_1.onload = function () {
                base = fileReader_1.result;
                document.getElementById('imgTest').style.backgroundImage = "url(" + base + ")";
            };
            fileReader_1.onloadend = function () {
                _this._IMGE = fileReader_1.result;
                console.log(_this._IMGE);
            };
            var a = fileReader_1.readAsDataURL(fileId[0]);
        }
    };
    ControlempaqueComponent.prototype.upFoto = function () {
        this.arrLFoto = {
            no_parte_i: localStorage.getItem('LoteSelect'),
            img_no_parte: this._IMGE
        };
        this.lote.upimg(localStorage.getItem('LoteSelect'), this.arrLFoto).subscribe(function (upf) {
            // console.log(upf);
            sweetalert2_1["default"].fire({
                icon: 'success',
                title: 'Bien!...',
                text: 'La imagen del producto se ha actualizado con éxito'
            });
        }, function (err) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Opps!...',
                text: 'Algo no ha salido bien revisa tu conexión...'
            });
        });
    };
    ControlempaqueComponent.prototype.getimgnparte = function (a) {
        var _this = this;
        this.lote.getimgbyNparte(a).subscribe(function (nimg) {
            _this.nimgArr = nimg;
            _this._IMGE = _this.nimgArr[0].img_no_parte;
        });
    };
    __decorate([
        core_1.ViewChild(angular2_qrscanner_1.QrScannerComponent, { static: false })
    ], ControlempaqueComponent.prototype, "qrScannerComponent");
    ControlempaqueComponent = __decorate([
        core_1.Component({
            selector: 'app-controlempaque',
            templateUrl: './controlempaque.component.html',
            styleUrls: ['./controlempaque.component.styl']
        })
    ], ControlempaqueComponent);
    return ControlempaqueComponent;
}());
exports.ControlempaqueComponent = ControlempaqueComponent;
