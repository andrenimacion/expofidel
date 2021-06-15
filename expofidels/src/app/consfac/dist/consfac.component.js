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
    function ConsfacComponent(dataFact, iDB, desSave, tGener, emServGen) {
        var _this = this;
        this.dataFact = dataFact;
        this.iDB = iDB;
        this.desSave = desSave;
        this.tGener = tGener;
        this.emServGen = emServGen;
        //var report INICIO
        this._reportBool = false;
        this.seesionToken = sessionStorage.getItem('Session-Key');
        this.arrFacts = [];
        this.arrFactsType = [];
        this.arrCursorFact = [];
        /* ----------------------- variables para transacciones INICIO -------------------------------------------- */
        //#region 
        this.arrCabSave = [];
        this.arrDetSave = [];
        this.em = [];
        this.Token = this.tGener.tGenerate(14);
        this.dataOfflineDBRecovery = [];
        // createStructureDataTransac(data) {
        //   this.iDB.createIndexedDB('transac-control-db', 1);
        //   this.iDB.saveDataIndexedDB('transac-control-db', 1, data);
        // }
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
        // public exeReportArr: any = [];
        // execReport() {    
        //   // console.log(localStorage.getItem('Comprobante-type'), localStorage.getItem('Comprobante-number'));
        //   this.desSave.getExecReport(sessionStorage.getItem('Session-Key'), 'despacho').subscribe (execr => {
        //     this.exeReportArr = execr;
        //     //this.getComprobantController(this.exeReportArr);
        //     console.log(this.exeReportArr);
        //   })
        // } 
        //this.exec(sessionStorage.getItem('Session-Key'), 'despacho')
        // controlSaveDataObserver() {
        //   this.observable = new Observable(subscriber => {
        //     subscriber.next(this.saveDespachos());
        //     subscriber.complete();
        //   });
        //   this.rxjsFunction();
        // }
        // rxjsFunction() {
        //   this.observable.subscribe({
        //     next(x) { x },
        //     error(err) { console.error('Ha ocurrido un error de ejecución: ' + err); },
        //     complete() {
        //       const Toast = Swal.mixin({
        //         toast: true,
        //         position: 'top-start',
        //         showConfirmButton: false,
        //         timer: 5000,
        //         timerProgressBar: true,
        //         didOpen: (toast) => {
        //           toast.addEventListener('mouseenter', Swal.stopTimer)
        //           toast.addEventListener('mouseleave', Swal.resumeTimer)
        //         }
        //       })
        //       Toast.fire({
        //         icon: 'success',
        //         html: `Transacción guardada exitosamente
        //                con token:<strong>${sessionStorage.getItem('Session-Key')}</strong>`
        //               })
        //      }
        //     });
        // }
        this._value = 0;
    }
    ConsfacComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.execReport();
        //this.deleteChilds('tbody-arr', document.getElementsByTagName('tr'));
        this.removesecuenceLocalStorage(1000);
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
    ConsfacComponent.prototype.removesecuenceLocalStorage = function (numberSecuenceClean) {
        for (var a = 0; a <= numberSecuenceClean; a++) {
            localStorage.removeItem("cantsScann-" + a);
        }
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
        console.log(this.arrCabSave);
        this.desSave.despachoSaveCab(this.arrCabSave).subscribe(function (scab) {
            _this.dataFact.getfactura('_opt_', _this.sliceNameFact, _this.sliceNameFactB, 'V')
                .subscribe(function (FACTS) {
                // Transaciiones generales;
                _this.arrFacts = FACTS;
                // this.createStructureDataTransac(this.arrFacts);
                /*Con este bucle recorremos el JSON de nuestra
                 petición GET this.dataFact.getfactura(...)
                 para enviar el resultado mediante
                 un POST hacia la base de datos... */
                //console.log(this.arrFacts);
                _this.observable = new rxjs_1.Observable(function (subscriber) {
                    subscriber.next(_this.saveDespachos());
                    for (var m = 0; m <= _this.arrFacts.length; m++) {
                        _this.arrDetSave = {
                            T_llave: sessionStorage.getItem('Session-Key'),
                            tempo: "despacho",
                            linea: _this.arrFacts[m].linea,
                            no_parte: _this.arrFacts[m].no_parte,
                            cantidad: localStorage.getItem("scann-" + m)
                        };
                        subscriber.next(_this.saveDetalle(_this.arrDetSave));
                    }
                    subscriber.next(_this.exec());
                    subscriber.complete();
                });
            });
        }, function (err) {
            console.log(err);
            // Swal.fire(
            //   '¿Problemas de conexión?',
            //   'Hemos guardado tu transacción en base de datos local. Con este token: ' + this.Token,
            //   'info'
            // )
        });
    };
    //#endregion
    ConsfacComponent.prototype.saveDetalle = function (content) {
        var _this = this;
        this.desSave.despachoSaveDet(content).subscribe(function (postDetail) {
            console.log(postDetail);
            _this.removesecuenceLocalStorage(1000);
        });
    };
    ConsfacComponent.prototype.getComprobantController = function (data) {
        this.iDB.createIndexedDB('comprobant-db', 1);
        this.iDB.saveDataIndexedDB('comprobant-db', 1, data);
    };
    ConsfacComponent.prototype.exec = function () {
        var _this = this;
        this.desSave.getExec(this.seesionToken, 'despacho').subscribe(function (exec) {
            _this.arrCursor = exec;
            console.log(_this.arrExec);
            _this._reportBool = true;
            var v = document.getElementById('tbody-arr');
            for (var i = 0; i <= _this.arrCursor.length; i++) {
                //---------------------------------------------------------------
                //bucle para recorre la cabecera
                _this._n_reporte = " #" + (_this.arrCursor[i][0].tipo + _this.arrCursor[i][0].numero);
                _this._cliente = _this.arrCursor[i][0].empcli;
                _this._direccion = _this.arrCursor[i][0].direccion;
                _this._bodega = _this.arrCursor[i][0].bodega;
                _this._concepto = _this.arrCursor[i][0].comenta;
                _this._ruc = _this.arrCursor[i][0].ruc;
                _this._telefono = _this.arrCursor[i][0].fono1;
                _this._emision = _this.arrCursor[i][0].fechA_TRA;
                _this._f_vencimiento = _this.arrCursor[i][0].fecha_ven;
                //---------------------------------------------------------------
                //bucle para recorrer el detalle
                for (var f = 0; f <= _this.arrCursor[i].length; f++) {
                    var create_tr = document.createElement('tr');
                    //const create_td = document.createElement('td');
                    var ctr = v.appendChild(create_tr);
                    _this.sumCantidad = Number(_this.arrCursor[i][f].cantidad);
                    ctr.innerHTML = "<td style='font-size: 8pt;'>\n                            " + _this.arrCursor[i][f].nombre + "\n                           </td>\n                           <td style='font-size: 8pt;'>\n                            " + _this.arrCursor[i][f].cantidad + "\n                           </td>\n                           <td style='font-size: 8pt;'>\n                            " + _this.arrCursor[i][f].despacho + "\n                           </td>\n                           <td style='font-size: 8pt;'>\n                            " + (_this.arrCursor[i][f].cantidad
                        - _this.arrCursor[i][f].despacho) + "\n                           </td> ";
                }
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
                console.log(localStorage.setItem("diferencia-" + mi, (Number(this.arrFacts[mi++].cantidad) - Number(c.value)).toString()));
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
        var v = document.getElementById('tbody-arr');
        //let z = <HTMLInputElement> document.getElementById('scann');
        this.dataFact.getfactura(a, b, c, d).subscribe(function (FACTS) {
            _this.arrFacts = FACTS;
            console.log(_this.arrFacts);
            //variables para localstorage
            localStorage.setItem('bodega', _this.arrFacts[0].bodega);
            _this._bodega = localStorage.getItem('bodega');
            //this.createStructureDataTransac(this.arrFacts);
            _this.scaningQR = 0;
            var _loop_1 = function (f) {
                var create_tr = document.createElement('tr');
                //const create_td = document.createElement('td'); 
                var ctr = v.appendChild(create_tr);
                //this.sumCantidad = Number(this.arrCursor[i][f].cantidad);
                var opertoral;
                var operMath = function (op1, op2) {
                    opertoral = op1 - op2;
                    console.log(opertoral);
                    return opertoral;
                };
                ctr.innerHTML = "<td style='font-size: 8pt;'>\n        " + _this.arrFacts[f].no_parte + "\n        </td>\n        <td style='font-size: 8pt;'>\n        " + _this.arrFacts[f].nomParte + "\n        </td>\n        <td style='font-size: 8pt;'>\n        " + _this.arrFacts[f].cantidad + "\n        </td>\n        <td style='font-size: 8pt;'>\n        <input type=\"number\" id=\"idInput-" + f + "\" style=\"color: gray !important;\" >\n        </td>\n        <td style='font-size: 8pt;'>\n          <span id=\"sp-" + f + "\" ></span>\n        </td>";
                //EVENTOS CREADOS PARA LA TABLA
                //#region addeventlisteners
                var bID = document.getElementById("idInput-" + f);
                _this.cotrolEventListeners("idInput-" + f, "sp-" + f, 'change', _this.arrFacts[f].cantidad, f);
                _this.cotrolEventListeners("idInput-" + f, "sp-" + f, 'click', _this.arrFacts[f].cantidad, f);
                _this.cotrolEventListeners("idInput-" + f, "sp-" + f, 'keyup', _this.arrFacts[f].cantidad, f);
            };
            for (var f = 0; f <= _this.arrFacts.length; f++) {
                _loop_1(f);
            }
        }, function (err) {
            console.log('No encontro la informacion' + err);
        });
    };
    ConsfacComponent.prototype.deleteChilds = function (objectID, removeObject) {
        document.getElementById(objectID).removeChild(removeObject);
    };
    ConsfacComponent.prototype.cotrolEventListeners = function (objectID, spanID, EVENT, valueB, secuence) {
        var valueID = document.getElementById(objectID);
        var sID = document.getElementById(spanID);
        valueID.addEventListener(EVENT, function () {
            if (Number(valueID.value) > valueB) {
                //valueID.disabled = true;
                valueID.style.border = 'solid 1px yellowgreen';
                sID.innerText = '0';
                valueID.value = valueB;
                localStorage.setItem("cantsScann-" + secuence, valueB);
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Hey',
                    text: 'Has llegado al límite!"'
                });
            }
            else {
                //valueID.disabled = false;
                sID.innerText = (valueB - Number(valueID.value)).toString();
                localStorage.setItem("cantsScann-" + secuence, (valueB - Number(valueID.value)).toString());
                localStorage.setItem("scann-" + secuence, (Number(valueID.value)).toString());
            }
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
