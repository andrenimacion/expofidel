"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ConsfacComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var rxjs_1 = require("rxjs");
var ConsfacComponent = /** @class */ (function () {
    //#endregion
    function ConsfacComponent(dataFact, iDB, desSave, tGener, emServGen) {
        var _this = this;
        this.dataFact = dataFact;
        this.iDB = iDB;
        this.desSave = desSave;
        this.tGener = tGener;
        this.emServGen = emServGen;
        this.seesionToken = sessionStorage.getItem('Session-Key');
        this.arrFacts = [];
        this.arrFactsType = [];
        this.arrCursorFact = [];
        /* variables para transacciones */
        //#region 
        this.arrCabSave = [];
        this.arrDetSave = [];
        this.em = [];
        this.Token = this.tGener.tGenerate(14);
        this.dataOfflineDBRecovery = [];
        this.sliceNameFactF = function (a, b) {
            _this.sliceNameFact = a.slice(0, 2);
            _this._typ = _this.sliceNameFact;
            localStorage.setItem('tipo', _this.sliceNameFact);
            _this.sliceNameFactB = a.slice(2, 10);
            localStorage.setItem('factura_number', _this.sliceNameFactB);
            _this._options = _this.sliceNameFactB;
            _this._name = b;
            _this.getFacts('_opt_', _this.sliceNameFact, _this.sliceNameFactB, 'V');
        };
        this.arrCursor = [];
        this.arrExec = [];
        this.exeReportArr = [];
        this._value = 0;
    }
    ConsfacComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.execReport();
        this.getFactType('0', '50');
        this.datesNow();
        this.dbREAD('scanDB');
        this.scaningQR = Number(localStorage.getItem('scann_number'));
        this._bodega = localStorage.getItem('bodega');
        this._typ = localStorage.getItem('tipo');
        this._options = localStorage.getItem('factura_number');
        this._name = localStorage.getItem('nomCliente');
        this.emServGen.getEmail().subscribe(function (email) {
            _this.em = email;
            _this.typeGen = email[0].tipoDespa_web;
            sessionStorage.setItem('Tipo', _this.typeGen);
        }, function (err) { });
    };
    ConsfacComponent.prototype.createStructureDataTransac = function (data) {
        this.iDB.createIndexedDB('transac-control-db', 1);
        this.iDB.saveDataIndexedDB('transac-control-db', 1, data);
    };
    ConsfacComponent.prototype.datesNow = function () {
        var fecha = new Date();
        var year = fecha.getFullYear();
        var day = fecha.getDay();
        var month = fecha.getMonth();
        return this._dateNow = month + "/" + day + "/" + year;
    };
    ConsfacComponent.prototype.dbREAD = function (bd) {
        var _this = this;
        var db;
        var request = indexedDB.open(bd, 1);
        //funcion que capta errores
        request.onerror = function (error) { return console.log(error); };
        //funcion capta los requirimientos positivos de mis transacciones
        request.onsuccess = function (e) {
            db = request.result;
            var transaction = db.transaction([bd], 'readwrite');
            var objectStore = transaction.objectStore(bd);
            objectStore.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    _this.arrCursor.push(cursor.value);
                    cursor["continue"]();
                    _this.scaningQR = _this.arrCursor.length;
                    localStorage.setItem(bd, _this.scaningQR.toString());
                }
            };
        };
        request.onupgradeneeded = function () {
            db = request.result;
            db.createObjectStore(bd, {
                autoIncrement: true
            });
        };
    };
    /* ------- GUARDAMOS LA CABECERA DE LA TRANSACCIÓN ------- */
    //#region 
    ConsfacComponent.prototype.saveDespachos = function () {
        var _this = this;
        sessionStorage.setItem('TRANSACCION-KEY', this.Token);
        sessionStorage.removeItem('TOKEN');
        this.arrCabSave = {
            T_llave: sessionStorage.getItem('Session-Key'),
            tempo: "despacho",
            tipo: sessionStorage.getItem('Tipo'),
            fecha_tra: new Date(),
            bodega: localStorage.getItem('bodega'),
            usercla: sessionStorage.getItem('Token-User'),
            referencia: this.sliceNameFact + this.sliceNameFactB
        };
        this.desSave.despachoSaveCab(this.arrCabSave).subscribe(function (scab) {
            _this.dataFact.getfactura('_opt_', _this.sliceNameFact, _this.sliceNameFactB, 'V').subscribe(function (FACTS) {
                // Transaciiones generales
                _this.arrFacts = FACTS;
                _this.createStructureDataTransac(_this.arrFacts);
                _this.exec();
                /*Con este bucle recorremos el JSON de nuestra petición GET this.dataFact.getfactura(...)
                  para enviar el resultado mediante un POST hacia la base de datos... */
                for (var m = 0; m <= _this.arrFacts.length; m++) {
                    _this.arrDetSave = {
                        T_llave: sessionStorage.getItem('Session-Key'),
                        tempo: "despacho",
                        linea: _this.arrFacts[m].linea,
                        no_parte: _this.arrFacts[m].no_parte,
                        cantidad: _this.arrFacts[m].cantidad
                    };
                    _this.desSave.despachoSaveDet(_this.arrDetSave).subscribe(function (postDetail) {
                        console.log(postDetail);
                    });
                }
            });
        }, function (err) {
            sweetalert2_1["default"].fire('¿Problemas de conexión?', 'Hemos guardado tu transacción en base de datos local. Con este token: ' + _this.Token, 'info');
        });
    };
    //#endregion
    /* -------CREAMOS UNA BASE DE DATOS LOCAL
    DONDE GUARDAMOS LA CABECERA DE LA TRANSACCIÓN ------- */
    // createRecoveryDBTransaccional(data) {
    //   this.iDB.createIndexedDB('transaction-db', 1);
    //   this.iDB.saveDataIndexedDB('transaction-db', 1, data);
    // }
    ConsfacComponent.prototype.getComprobantController = function (data) {
        this.iDB.createIndexedDB('comprobant-db', 1);
        this.iDB.saveDataIndexedDB('comprobant-db', 1, data);
    };
    ConsfacComponent.prototype.exec = function () {
        var _this = this;
        this.desSave.getExec(this.seesionToken, 'despacho').subscribe(function (exec) {
            _this.arrExec = exec;
            _this.comproba = _this.arrExec[0].comproba;
            _this.comprobaA = _this.comproba.slice(0, 2);
            _this.comprobaB = _this.comproba.slice(2, 10);
            localStorage.setItem('Comprobante-type', _this.comprobaA);
            localStorage.setItem('Comprobante-number', _this.comprobaB);
            console.log(_this.comproba);
        });
    };
    ConsfacComponent.prototype.execReport = function () {
        var _this = this;
        this.desSave.getExecReport(localStorage.getItem('Comprobante-type'), localStorage.getItem('Comprobante-number')).subscribe(function (execr) {
            _this.exeReportArr = execr;
            _this.getComprobantController(_this.exeReportArr);
            console.log(_this.exeReportArr);
        });
    };
    //this.exec(sessionStorage.getItem('Session-Key'), 'despacho')
    ConsfacComponent.prototype.controlSaveDataObserver = function () {
        var _this = this;
        this.observable = new rxjs_1.Observable(function (subscriber) {
            subscriber.next(_this.saveDespachos());
            subscriber.next(_this.execReport());
            subscriber.complete();
        });
        this.rxjsFunction();
    };
    ConsfacComponent.prototype.rxjsFunction = function () {
        this.observable.subscribe({
            next: function (x) { x; },
            error: function (err) { console.error('something wrong occurred: ' + err); },
            complete: function () {
                var Toast = sweetalert2_1["default"].mixin({
                    toast: true,
                    position: 'top-start',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: function (toast) {
                        toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                        toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
                    }
                });
                Toast.fire({
                    icon: 'success',
                    html: "Transacci\u00F3n guardada exitosamente\n                 con token:<strong>" + sessionStorage.getItem('Session-Key') + "</strong>"
                });
            }
        });
    };
    ConsfacComponent.prototype.valdeteScann = function () {
        // localStorage.setItem('p_diferen', a);
        //this.total = localStorage.getItem('p_diferen');
        var b = document.getElementsByTagName('input');
        var ta = document.getElementsByTagName('textarea');
        for (var mi = 0; mi < 1000; mi++) {
            for (var ma = 8; ma < b.length; ma++) {
                b[ma].setAttribute('id', "id-" + ma);
                var c = document.getElementById("id-" + ma);
                localStorage.setItem("scan-qr-" + ma, (Number(c.value)).toString());
                //console.log((ma + 1));
                localStorage.setItem("diferencia-" + mi, (Number(this.arrFacts[mi++].cantidad) - Number(c.value)).toString());
                //console.log(this.arrFacts[mi].cantidad);
            }
        }
        // if(a > localStorage.getItem('p_cantidad')) {
        //   this.scaningQR = Number(localStorage.getItem('p_cantidad'));
        //   const Toast = Swal.mixin({
        //     toast: true,
        //     position: 'top-end',
        //     showConfirmButton: false,
        //     timer: 5000,
        //     timerProgressBar: true,
        //     didOpen: (toast) => {
        //       toast.addEventListener('mouseenter', Swal.stopTimer)
        //       toast.addEventListener('mouseleave', Swal.resumeTimer)
        //     }
        //   })
        //   Toast.fire ({
        //     icon: 'info',
        //     title: 'Haz eccedido el limite de escaneos con relación a la cantidad estipulada'
        //   })
        //   b.disabled = true;
        // }
    };
    ConsfacComponent.prototype.getFactsUnit = function (type, top) {
        var _this = this;
        this.dataFact.getfacttype(type, top).subscribe(function (typef) {
            _this.arrFactsType = typef;
            console.log(_this.arrFactsType);
        }, function (err) {
            sweetalert2_1["default"].fire({
                title: 'No se pudo concretar tu busqueda',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        });
    };
    /*  OBTIENE LA CABECERA Y DETALLE DE LA FACTURA A SELECCIONAR */
    //#region
    ConsfacComponent.prototype.getFacts = function (a, b, c, d) {
        var _this = this;
        //let z = <HTMLInputElement> document.getElementById('scann');
        this.dataFact.getfactura(a, b, c, d).subscribe(function (FACTS) {
            _this.arrFacts = FACTS;
            // esto es las transaciiones generales
            _this.createStructureDataTransac(_this.arrFacts);
            _this.scaningQR = 0;
            //z.disabled = false;
            for (var k = 0; k < _this.arrFacts.length; k++) {
                console.log('funcionando');
                _this._bodega = _this.arrFacts[k].bodega;
                localStorage.setItem("cantidad-" + k, _this.arrFacts[k].cantidad);
                //localStorage.setItem(`diferencia-${k}`, this.arrFacts[k].cantidad);
            }
        }, function (err) {
            console.log('No encontro la informacion' + err);
        });
    };
    //#endregion
    ConsfacComponent.prototype.getFactType = function (type, top) {
        var _this = this;
        this.dataFact.getfacttype(type, top).subscribe(function (typef) {
            _this.arrFactsType = typef;
        });
    };
    ConsfacComponent = __decorate([
        core_1.Component({
            selector: 'app-consfac',
            templateUrl: './consfac.component.html',
            styleUrls: ['./consfac.component.styl']
        })
    ], ConsfacComponent);
    return ConsfacComponent;
}());
exports.ConsfacComponent = ConsfacComponent;
