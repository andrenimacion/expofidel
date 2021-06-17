"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmailcontrollerComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var keycodes_1 = require("@angular/cdk/keycodes");
var EmailcontrollerComponent = /** @class */ (function () {
    function EmailcontrollerComponent(date, eSend, getMail) {
        this.date = date;
        this.eSend = eSend;
        this.getMail = getMail;
        this.arrMail = [];
        this.arrMessageDB = [];
        this.dateN = this.date.date();
        this.arrMAILBD = [];
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.separatorKeysCodes = [keycodes_1.ENTER, keycodes_1.COMMA];
        this.fruits = [
            { name: sessionStorage.getItem('Email-Principal') }
        ];
    }
    EmailcontrollerComponent.prototype.ngOnInit = function () {
        this.getMailDBSQL();
        this._email = sessionStorage.getItem('Email-Principal');
    };
    EmailcontrollerComponent.prototype.getValueCheck = function (a) {
        console.log(a);
        if (!a) {
            this.messageComplete = "<span style='color: gray; font-size: 8pt;'>No se ha adherido el detalle al mensaje principal...</span>";
            return this.messageComplete;
        }
        else {
            this.messageComplete = "<strong> Nombre cliente: </strong> " + localStorage.getItem('nomCliente') + " <hr>" +
                ("<strong> Comprobante: </strong> " + localStorage.getItem('comprobante') + " <hr>") +
                ("<strong> Bodega: </strong> " + localStorage.getItem('bodega') + " <hr>") +
                "<br><table style='width: 100%;'>" +
                "<thead style='background-color: #444; color: white;'>" +
                "<th>Código</th>" +
                "<th>Nombre</th>" +
                "<th>Cantidad</th>" +
                "<th>Escaneo</th>" +
                "<th>Diferencia</th>" +
                "</thead>" +
                "<tbody style='background-color: #FAC193;'>" +
                "<tr>" +
                ("<th>" + localStorage.getItem('p_codigo') + "</th>") +
                ("<td>" + localStorage.getItem('p_nombre') + "</td>") +
                ("<td>" + localStorage.getItem('p_cantidad') + "</td>") +
                ("<td>" + localStorage.getItem('p_escaneo') + "</td>") +
                ("<td>" + (Number(localStorage.getItem('p_cantidad')) - Number(localStorage.getItem('p_escaneo'))) + "</td>") +
                "</tr>" +
                "</tbody>" +
                "</table>";
            return this.messageComplete;
        }
    };
    EmailcontrollerComponent.prototype.getMailDBSQL = function () {
        var _this = this;
        this.getMail.getEmail().subscribe(function (EMAIL) {
            _this.arrMAILBD = EMAIL;
            console.log(_this.arrMAILBD);
            //mail principal de la empresa, añadido a una variable de sessionStorage
            sessionStorage.setItem('Email-Principal', _this.arrMAILBD[0].email_despacho_web);
        });
    };
    EmailcontrollerComponent.prototype.updateUniqueMail = function () {
        this.getMail.updtEmail(this.arrMAILBD).subscribe(function (UPDEMAIL) {
            sweetalert2_1["default"].fire({
                position: 'top-end',
                icon: 'success',
                title: 'Se ha editado el correo principal, de envío de reportes de esta cuenta.',
                showConfirmButton: false,
                timer: 1500
            });
        }, function (err) {
            sweetalert2_1["default"].fire({
                position: 'top-end',
                icon: 'error',
                title: 'No se ha editado el correo principal, debido a que tienes mala conexión',
                showConfirmButton: false,
                timer: 1500
            });
        });
    };
    EmailcontrollerComponent.prototype.add = function (event) {
        var value = (event.value || '').trim();
        // Add our fruit
        if (value) {
            this.fruits.push({
                name: value
            });
            var Toast = sweetalert2_1["default"].mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: function (toast) {
                    toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                    toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
                }
            });
            Toast.fire({
                icon: 'success',
                html: "Se ha a\u00F1adido nuevo correo <strong>" + value + "</strong>"
            });
        }
        // console.log(this.fruits)
        // Clear the input value
        // event.input.c
    };
    EmailcontrollerComponent.prototype.remove = function (fruit) {
        var index = this.fruits.indexOf(fruit);
        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    };
    EmailcontrollerComponent.prototype.sendMailRecover = function (a, b, c, d) {
        this.arrMail = {
            txtPara: a,
            txtAsunto: c,
            txtCopia: b,
            txtMensaje: d,
            MailAddress: "syscompsasa@gmail.com",
            passwordMail: "sysgye2016",
            date_send_mail: new Date()
        };
        console.log(this.arrMail);
        this.eSend.SendMailJson(this.arrMail).subscribe(function (sendMail) {
            console.log(sendMail);
        }, function (err) {
            // alert('No se ha podido enviar el email, revisar bien los permisos');
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se envio el correo electrónico!',
                footer: 'Revisa tu conexión o la configuración de tu correo.'
            });
        });
    };
    EmailcontrollerComponent = __decorate([
        core_1.Component({
            selector: 'app-emailcontroller',
            templateUrl: './emailcontroller.component.html',
            styleUrls: ['./emailcontroller.component.styl']
        })
    ], EmailcontrollerComponent);
    return EmailcontrollerComponent;
}());
exports.EmailcontrollerComponent = EmailcontrollerComponent;
