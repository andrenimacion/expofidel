"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TransferbodService = void 0;
var core_1 = require("@angular/core");
var TransferbodService = /** @class */ (function () {
    function TransferbodService(http) {
        var _this = this;
        this.http = http;
        this.urlapi = 'https://alp-cloud.com:8453/api/';
        this.getBodegas = function (filter) { return _this.http.get(_this.urlapi + 'transferbode/getBodegas/' + filter); };
        this.getProdBod = function (bodega, date) { return _this.http.get(_this.urlapi + 'transferbode/getBodegasProducts/' + bodega + '/' + date); };
        this.saveProdBod = function (model) { return _this.http.post(_this.urlapi + 'transferbode/save_transfer/', model); };
        this.updateProdBod = function (id, model) { return _this.http.put(_this.urlapi + 'transferbode/puttransprod/' + id, model); };
        this.delProdBod = function (id) { return _this.http.get(_this.urlapi + 'transferbode/deltransprod/' + id); };
        this.genProdBod = function () { return _this.http.get(_this.urlapi + 'transferbode/gettransprod'); };
        this.getTransacProd = function () { return _this.http.get(_this.urlapi + 'transferbode/getTransacProd'); };
        //========================== SAVE CABECERA y DETALLE INICIO =========================
        this.saveCab = function (model) { return _this.http.post(_this.urlapi + 'transferbode/save_transfer_cab', model); };
        this.saveDet = function (model) { return _this.http.post(_this.urlapi + 'transferbode/save_transfer_det', model); };
        //==================================== FIN ==========================================
        //============================ EXEC COMPROBANTE INICIO ==============================
        this.exec = function (key, tempo) { return _this.http.get(_this.urlapi + 'transferbode/getCodectransfer/' + key + '/' + tempo); };
        //============================== EXEC COMPROBANTE FIN ===============================
        this.getGraphicGen = function () { return _this.http.get(_this.urlapi + 'transferbode/getGrafic'); };
    }
    TransferbodService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TransferbodService);
    return TransferbodService;
}());
exports.TransferbodService = TransferbodService;
