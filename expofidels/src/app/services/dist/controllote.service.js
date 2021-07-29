"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ControlloteService = void 0;
var core_1 = require("@angular/core");
var ControlloteService = /** @class */ (function () {
    function ControlloteService(http) {
        this.http = http;
        this.apiURL = 'https://alp-cloud.com:8453/api';
    }
    ControlloteService.prototype.getLoteFilter = function (filter, top) {
        return this.http.get(this.apiURL + '/products/getLote/' + filter + '/' + top);
    };
    ControlloteService.prototype.upimg = function (pk, content) {
        return this.http.put(this.apiURL + '/img_lote/put_imge_lote/' + pk, content);
    };
    ControlloteService.prototype.getimgbyNparte = function (nparte) {
        return this.http.get(this.apiURL + '/products/getLoteimg/' + nparte);
    };
    // http://localhost:5000/api/products/estadoLote/T/EM/00000001
    ControlloteService.prototype.updateEstate = function (estadolote, tipo, numero) {
        return this.http.get(this.apiURL + '/products/estadoLote/' + estadolote + '/' + tipo + '/' + numero);
    };
    ControlloteService.prototype.getloteFilterExec = function (filter, opts) {
        return this.http.get(this.apiURL + '/products/getLoteFilter/' + filter + '/' + opts);
    };
    ControlloteService.prototype.getloteFilterNProd = function (filter, noparte) {
        return this.http.get(this.apiURL + '/products/getLoteCodNpart/' + filter + '/' + noparte);
    };
    ControlloteService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ControlloteService);
    return ControlloteService;
}());
exports.ControlloteService = ControlloteService;
