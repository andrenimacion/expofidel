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
    function ReporteComponent(dReport) {
        this.dReport = dReport;
        this.arrCursor = [];
    }
    ReporteComponent.prototype.ngOnInit = function () {
        //this.dbRead('comprobant-db');  
        this.getReport();
        var foot = document.getElementById('foot');
        this._footer = "Los\u00A0precios\u00A0de\u00A0la\u00A0siguiente\u00A0Cotizaci\u00F3n\u00A0estan\u00A0sujetos\u00A0a\u00A0cambio\u00A0sin\u00A0previo\u00A0aviso\n                    Matriz:\u00A0Chile\u00A01810/12\u00A0y\u00A0Gomez\u00A0Rendon\u00A0\u00A0 Telefono:\u00A02414-732\u00A0-\u00A0\u00A02414-775 Email:\u00A0Ventas@ibea.com.ec\u00A0\n                    Sucursal:\u00A0Urdesa\u00A0Central\u00A0Av.\u00A0Jorge\u00A0Perez\u00A0Concha\u00A0321\u00A0y\u00A0calle\u00A0diagonal Telefono:\u00A06007373\u00A0-\u00A02386121\n                    Email:\u00A0Infosucursal@ibea.com.ec\u00A0-\u00A0rgarcia@ibeasa.co";
    };
    // dbRead(bd) {
    //   //console.log('leyendo data cabecera');
    //   var db;
    //   const request = indexedDB.open(bd, 1); 
    //   request.onerror = (error) => console.log(error);
    //   let v = document.getElementById('tbody-arr');    
    //   //funcion capta los requirimientos positivos de mis transacciones
    //   request.onsuccess = (e) => {
    //     db = request.result;
    //     const transaction =  db.transaction([bd], 'readwrite');
    //     const objectStore = transaction.objectStore(bd);
    //     objectStore.openCursor().onsuccess = (e) => {        
    //       const cursor = e.target.result; 
    //       if( cursor ) {        
    //         this.arrCursor.push(cursor.value);
    //         cursor.continue();
    //         console.log(this.arrCursor);          
    // for(let i = 0; i <= this.arrCursor.length; i++ ) {
    //   //---------------------------------------------------------------
    //   //bucle para recorre la cabecera
    //   this._n_reporte = ` #${this.arrCursor[i][0].tipo + this.arrCursor[i][0].numero}`; 
    //   this._cliente   = this.arrCursor[i][0].empcli;
    //   this._direccion = this.arrCursor[i][0].direccion;
    //   this._bodega    = this.arrCursor[i][0].bodega;
    //   this._concepto  = this.arrCursor[i][0].comenta;
    //   this._ruc       = this.arrCursor[i][0].ruc;
    //   this._telefono  = this.arrCursor[i][0].fono1;
    //   this._emision   = this.arrCursor[i][0].fechA_TRA;
    //   this._f_vencimiento   = this.arrCursor[i][0].fecha_ven;            
    //   //---------------------------------------------------------------
    //   //bucle para recorrer el detalle
    //   for(let f = 0; f <= this.arrCursor[i].length; f++) {              
    //     const create_tr = document.createElement('tr');
    //     const create_td = document.createElement('td');               
    //     let ctr = v.appendChild(create_tr);
    //     this.sumCantidad = Number(this.arrCursor[i][f].cantidad);
    //     ctr.innerHTML = `<td style='font-size: 8pt;'>
    //                       ${this.arrCursor[i][f].nombre}
    //                      </td>
    //                      <td style='font-size: 8pt;'>
    //                       ${this.arrCursor[i][f].cantidad}
    //                      </td>
    //                      <td style='font-size: 8pt;'>
    //                       ${this.arrCursor[i][f].despacho}
    //                      </td>
    //                      <td style='font-size: 8pt;'>
    //                       ${this.arrCursor[i][f].cantidad 
    //                       - this.arrCursor[i][f].despacho }
    //                      </td> `;
    //   }
    // }          
    //       }
    //     }
    //   }
    //   request.onupgradeneeded = () => {
    //     db = request.result;
    //     db.createObjectStore(bd, {
    //       autoIncrement: true
    //     });
    //   }
    // }
    ReporteComponent.prototype.getReport = function () {
        this.dReport.getExec(sessionStorage.getItem('Session-Key'), 'despacho')
            .subscribe(function (report) {
            console.log(report);
        });
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
