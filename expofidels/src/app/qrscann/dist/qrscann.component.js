"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QrscannComponent = void 0;
var core_1 = require("@angular/core");
var angular2_qrscanner_1 = require("angular2-qrscanner");
var QrscannComponent = /** @class */ (function () {
    function QrscannComponent(iDB) {
        this.iDB = iDB;
        this.arrNum = [];
        this.contador = 0;
        this.camCont = true;
        this.camera = 'Front';
        this.codPRODS = '---';
        this.devices = [];
        this.arrJornDataUnit = [];
        this.pLabores = false;
        this.pIngresado = false;
        this.scannerQR = false;
    }
    QrscannComponent.prototype.ngOnInit = function () {
        // localStorage.removeItem('cp');
    };
    QrscannComponent.prototype.ngAfterViewInit = function () {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        // this.cameraControl(this.camera);
    };
    __decorate([
        core_1.ViewChild(angular2_qrscanner_1.QrScannerComponent, { static: false })
    ], QrscannComponent.prototype, "qrScannerComponent");
    QrscannComponent = __decorate([
        core_1.Component({
            selector: 'app-qrscann',
            templateUrl: './qrscann.component.html',
            styleUrls: ['./qrscann.component.styl']
        })
    ], QrscannComponent);
    return QrscannComponent;
}());
exports.QrscannComponent = QrscannComponent;
