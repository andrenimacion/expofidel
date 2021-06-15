"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TInvcabgControllerService = void 0;
var core_1 = require("@angular/core");
var TInvcabgControllerService = /** @class */ (function () {
    function TInvcabgControllerService(http) {
        var _this = this;
        this.http = http;
        this.apiURL = 'https://alp-cloud.com:8453/api';
        // Guardamos la cabecera de lo despachado
        this.despachoSaveCab = function (content) { return _this.http.post(_this.apiURL + '/despachos_control_cab/save_despacho_cab', content); };
        // Guardamos el detalle de lo despachado
        this.despachoSaveDet = function (content) { return _this.http.post(_this.apiURL + '/despachos_control_det/save_despacho_det', content); };
        //procedimientos almacenados
        this.getExec = function (token, pk2) { return _this.http.get(_this.apiURL + '/despachos_control_cab/getExec/' + token + '/' + pk2); };
        this.getExecReport = function (type, number) { return _this.http.get(_this.apiURL + '/despachos_control_cab/getExecReport/' + type + '/' + number); };
    }
    TInvcabgControllerService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TInvcabgControllerService);
    return TInvcabgControllerService;
}());
exports.TInvcabgControllerService = TInvcabgControllerService;
