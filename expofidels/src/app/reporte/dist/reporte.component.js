"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReporteComponent = void 0;
var core_1 = require("@angular/core");
var ReporteComponent = /** @class */ (function () {
    function ReporteComponent() {
        this.arrCursor = [];
    }
    ReporteComponent.prototype.ngOnInit = function () {
        this.dbRead('comprobant-db');
        var foot = document.getElementById('foot');
        this._footer = "Los\u00A0precios\u00A0de\u00A0la\u00A0siguiente\u00A0Cotizaci\u00F3n\u00A0estan\u00A0sujetos\u00A0a\u00A0cambio\u00A0sin\u00A0previo\u00A0aviso\n                    Matriz:\u00A0Chile\u00A01810/12\u00A0y\u00A0Gomez\u00A0Rendon\u00A0\u00A0 Telefono:\u00A02414-732\u00A0-\u00A0\u00A02414-775 Email:\u00A0Ventas@ibea.com.ec\u00A0\n                    Sucursal:\u00A0Urdesa\u00A0Central\u00A0Av.\u00A0Jorge\u00A0Perez\u00A0Concha\u00A0321\u00A0y\u00A0calle\u00A0diagonal Telefono:\u00A06007373\u00A0-\u00A02386121\n                    Email:\u00A0Infosucursal@ibea.com.ec\u00A0-\u00A0rgarcia@ibeasa.co";
    };
    ReporteComponent.prototype.dbRead = function (bd) {
        var _this = this;
        //console.log('leyendo data cabecera');
        var db;
        var request = indexedDB.open(bd, 1);
        request.onerror = function (error) { return console.log(error); };
        var v = document.getElementById('tbody-arr');
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
                    console.log(_this.arrCursor);
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
                            var create_td = document.createElement('td');
                            var ctr = v.appendChild(create_tr);
                            _this.sumCantidad = Number(_this.arrCursor[i][f].cantidad);
                            ctr.innerHTML = "<td style='font-size: 8pt;'>\n                                " + _this.arrCursor[i][f].nombre + "\n                               </td>\n                               <td style='font-size: 8pt;'>\n                                " + _this.arrCursor[i][f].cantidad + "\n                               </td>\n                               <td style='font-size: 8pt;'>\n                                " + _this.arrCursor[i][f].despacho + "\n                               </td>\n                               <td style='font-size: 8pt;'>\n                                " + (_this.arrCursor[i][f].cantidad
                                - _this.arrCursor[i][f].despacho) + "\n                               </td> ";
                        }
                    }
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
    ReporteComponent = __decorate([
        core_1.Component({
            selector: 'app-reporte',
            templateUrl: './reporte.component.html',
            styleUrls: ['./reporte.component.styl']
        })
    ], ReporteComponent);
    return ReporteComponent;
}());
exports.ReporteComponent = ReporteComponent;
