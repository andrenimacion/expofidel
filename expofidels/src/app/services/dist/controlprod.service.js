"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ControlprodService = void 0;
var core_1 = require("@angular/core");
var ControlprodService = /** @class */ (function () {
    function ControlprodService(http, iDB) {
        var _this = this;
        this.http = http;
        this.iDB = iDB;
        this.urlapi = 'https://alp-cloud.com:8453/api/';
        //obtiens los tipos las facturas por parámetros
        //exec AR_controlprod
        this.getfactura = function (a, b, c, d) { return _this.http.get(_this.urlapi + ("controlprod/getFACTS/" + a + "/" + b + "/" + c + "/" + d)); };
        //obtiens los tipos de facturas existentes
        this.getfacttype = function (type, top) { return _this.http.get(_this.urlapi + ("controlprod/getFactsType/" + type + "/" + top)); };
    }
    //obtiens los tipos de facturas existentes
    //getfacttypegen = (type) => this.http.get( this.urlapi + `controlprod/getFactsGen/${type}`);
    ControlprodService.prototype.createLibraryFacts = function (data) {
        console.log(data);
        this.iDB.createIndexedDB('facturas-type-DB', 1);
        this.iDB.saveDataIndexedDB('facturas-type-DB', 1, data);
    };
    ControlprodService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ControlprodService);
    return ControlprodService;
}());
exports.ControlprodService = ControlprodService;
