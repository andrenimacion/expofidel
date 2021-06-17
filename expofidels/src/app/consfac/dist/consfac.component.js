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
var http_1 = require("@angular/common/http");
var ConsfacComponent = /** @class */ (function () {
    function ConsfacComponent(dataFact, iDB, desSave, tGener, emServGen, emailReport) {
        var _this = this;
        this.dataFact = dataFact;
        this.iDB = iDB;
        this.desSave = desSave;
        this.tGener = tGener;
        this.emServGen = emServGen;
        this.emailReport = emailReport;
        //foter INICIO
        this._footer = "POFIDEL - ";
        //foter FIN
        //var report INICIO
        this._reportBool = false;
        this.seesionToken = sessionStorage.getItem('Session-Key');
        this.arrFacts = [];
        this.arrFactsType = [];
        this._dateNow = new Date();
        this.arrCursorFact = [];
        /* ----------------------- variables para transacciones INICIO -------------------------------------------- */
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
        this.arrMailSendJSON = [];
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
        this.removesecuenceLocalStorage(1000);
        this.getFactType('0', '50');
        //this.datesNow();
        this.dbREAD('scanDB');
        this.scaningQR = Number(localStorage.getItem('scann_number'));
        this._bodega = localStorage.getItem('bodega');
        this._typ = localStorage.getItem('tipo');
        this._options = localStorage.getItem('factura_number');
        this._name = localStorage.getItem('nomCliente');
        //var tbodyRes = document.getElementById('tbody-arr');
        //console.log(tbodyRes);
        this.emServGen.getEmail().subscribe(function (email) {
            _this.em = email;
            _this.typeGen = email[0].tipoDespa_web;
            sessionStorage.setItem('Tipo', _this.typeGen);
        }, function (err) { });
    };
    ConsfacComponent.prototype.resize = function (a, b, c, height) {
        var ziner = document.getElementById(a);
        ziner.style.width = "" + b + c;
        ziner.style.top = '0px';
        ziner.style.left = '0px';
        if (height == 0) {
            ziner.style.height = screen.height + 'px';
        }
        else {
            ziner.style.height = height + 'px';
        }
    };
    ConsfacComponent.prototype.close = function () {
        var tbodyReport = document.getElementById('domtab');
        var exbox = document.getElementById('exbox');
        //this._reportBool = false;
        exbox.style.display = 'none';
        for (var m = 0; m < 2000; m++) {
            var atr = document.getElementById("trTabReport-" + m);
            tbodyReport.removeChild(atr);
        }
        setTimeout(function () {
            location.reload();
        }, 1000);
    };
    ConsfacComponent.prototype.removesecuenceLocalStorage = function (numberSecuenceClean) {
        for (var a = 0; a <= numberSecuenceClean; a++) {
            localStorage.removeItem("cantsScann-" + a);
        }
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
            if (scab.type == http_1.HttpEventType.UploadProgress) {
                _this.upload = scab.loaded / 1000000;
                _this.uploadTotal = scab.total / 1000000; //total bytes to upload
                _this.porcentUploadTotal = (_this.upload / _this.uploadTotal) * 100;
                console.log(_this.porcentUploadTotal + '...%');
                //document.getElementById('pBar').style.width = this.porcentUploadTotal + '%';
            }
            console.log(scab);
            console.log(_this.arrFacts);
            if (scab.type === http_1.HttpEventType.Response) {
                for (var v_1 = 0; v_1 < _this.arrFacts.length; v_1++) {
                    _this.arrDetSave = {
                        T_llave: sessionStorage.getItem('Session-Key'),
                        tempo: "despacho",
                        linea: _this.arrFacts[v_1].linea,
                        no_parte: _this.arrFacts[v_1].no_parte,
                        cantidad: localStorage.getItem("scann-" + v_1)
                    };
                    _this.saveDetalle(_this.arrDetSave);
                    //console.log(this.arrDetSave);
                }
                setTimeout(function () {
                    console.log('EXEC');
                    _this.exec();
                }, 1500);
            }
            var v = document.getElementById('tbody-arr');
            setTimeout(function () {
                for (var y = 0; y < 2000; y++) {
                    var atr = document.getElementById("trPrincipal" + y);
                    v.removeChild(atr);
                }
            }, 1500);
        }, function (err) {
            console.log(err);
        });
    };
    //#endregion
    ConsfacComponent.prototype.saveDetalle = function (content) {
        var _this = this;
        this.desSave.despachoSaveDet(content).subscribe(function (postDetail) {
            console.log(postDetail);
            _this.removesecuenceLocalStorage(1000);
            _this._reportBool = true;
        });
    };
    ConsfacComponent.prototype.sendMail = function () {
        var tbodyReport = document.getElementById('domtab').outerHTML;
        this.arrMailSendJSON = {
            txtPara: "andrenimacion@gmail.com",
            txtAsunto: "Reporte de despacho: " + this._n_reporte + " ",
            txtCopia: "syscompsasa@gmail.com",
            txtMensaje: "<div style=\"padding: 15px; border: solid 2px gray; \n                    border-top-right-radius: 5px; border-top-left-radius: 5px;\">\n                      <div>\n                        <div> <strong> Reporte de despacho: </strong> " + this._n_reporte + " </div>\n                        <div> <strong> Cliente: </strong> " + this._cliente + " </div><hr>\n                      </div>\n                      <div>\n                        <div> <strong> Direcci\u00F3n: </strong> " + this._direccion + "</div>\n                        <div> <strong> Bodega: </strong> " + this._bodega + " </div><hr>\n                      </div>\n                      <div>\n                        <div> <strong> Concepto: </strong> " + this._concepto + "</div>\n                        <div> <strong> R.U.C.: </strong> " + this._ruc + " </div><hr>\n                      </div>\n                      <div>\n                        <div> <strong> Telefono: </strong> " + this._telefono + "</div>\n                        <div> <strong> Emision: </strong> " + this._emision + "</div><hr>\n                      </div>                      \n                    </div>\n                    <hr>\n                    <div>\n                    <table style=\"width: 100%;\">\n                    <thead style='background-color: #444; color: white;'>\n                    <th>Detalle</th>\n                    <th>Cantidad</th>\n                    <th>Despachado</th>\n                    <th>Total</th>\n                    </thead>\n                    <tbody style='background-color: #FAC193;'>\n                      " + tbodyReport + "\n                    </tbody>\n                    </table>\n                    <hr style=\"border: dotted 2px gray;\">\n                    Fecha de vencimiento: " + this._f_vencimiento + "\n                    <h5><strong> POFIDEL - " + new Date() + " - ECUADOR </strong></h5>\n                    <strong>Nota:</strong> No responder este email...\n                   </div>",
            MailAddress: "syscompsasa@gmail.com",
            passwordMail: "sysgye2016",
            date_send_mail: new Date()
        };
        console.log(this.arrMailSendJSON);
        this.emailReport.SendMailJson(this.arrMailSendJSON).subscribe(function (mail) {
            console.log(mail);
            sweetalert2_1["default"].fire({
                icon: 'success',
                title: 'Oops...',
                text: 'Se ha enviado el correo electrónico, con éxito!'
            });
        }, function () {
            sweetalert2_1["default"].fire({
                icon: 'success',
                title: 'Bien...',
                text: 'Se ha enviado el correo electrónico, con éxito!'
            });
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
            // console.log(this.arrCursor);
            for (var i = 0; i <= _this.arrCursor.length; i++) {
                //---------------------------------------------------------------
                //bucle para recorre la cabecera
                _this._n_reporte = " #" + (_this.arrCursor[i].tipo + _this.arrCursor[i].numero);
                _this._cliente = _this.arrCursor[i].empcli;
                _this._direccion = _this.arrCursor[i].direccion;
                _this._bodega = _this.arrCursor[i].bodega;
                _this._concepto = _this.arrCursor[i].comenta;
                _this._ruc = _this.arrCursor[i].ruc;
                _this._telefono = _this.arrCursor[i].fono1;
                _this._emision = _this.arrCursor[i].fechA_TRA;
                _this._f_vencimiento = _this.arrCursor[i].fecha_ven;
                //---------------------------------------------------------------
                //Creamos la tabla y la insertamos como HTML
                var tbodyReport = document.getElementById('domtab');
                var create_tr = document.createElement('tr');
                var ctr = tbodyReport.appendChild(create_tr);
                create_tr.setAttribute('id', "trTabReport-" + i);
                _this.tableSend = "<td style='font-size: 8pt;'>\n                              " + _this.arrCursor[i].nombre + "\n                           </td>\n                           <td style='font-size: 8pt;'>\n                              " + _this.arrCursor[i].cantidad + "\n                           </td>\n                           <td style='font-size: 8pt;'>\n                              " + _this.arrCursor[i].despacho + "\n                           </td>\n                           <td style='font-size: 8pt;'>\n                              " + (_this.arrCursor[i].cantidad - _this.arrCursor[i].despacho) + "\n                           </td>";
                ctr.innerHTML = _this.tableSend;
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
        //const tbodyReport = document.getElementById('domtab');
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
                create_tr.setAttribute('id', "trPrincipal" + f);
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
