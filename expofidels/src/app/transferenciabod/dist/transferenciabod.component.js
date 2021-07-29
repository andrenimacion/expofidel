"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TransferenciabodComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var am4core = require("@amcharts/amcharts4/core");
var am4charts = require("@amcharts/amcharts4/charts");
var animated_1 = require("@amcharts/amcharts4/themes/animated");
var TransferenciabodComponent = /** @class */ (function () {
    function TransferenciabodComponent(gb, route, report) {
        this.gb = gb;
        this.route = route;
        this.report = report;
        this.repoBool = false;
        this._tipoCosto = 'PROM';
        this.arrBodegas = [];
        this.boolBodegas = false;
        this.boolBodegasB = false;
        this._boolTableShow = false;
        this._bodserBool = false;
        this.boolBodOri = true;
        this.prodBodArr = [];
        this._boolLift = false;
        this.arrTransac = [];
        this.tTransBool = false;
        this._fechaAct = new Date();
        this.count = 1;
        this.repoArr = [];
        this.ArrSP_GRAFICAWEB = [];
        this.cantProdBod = 0;
        this.arrProd = [];
        this.boolUp = false;
        this.modelTPtod = [];
        this.arrGenTransProd = [];
    }
    TransferenciabodComponent.prototype.ngOnInit = function () {
        this.gBodegas('0');
        this.getTransacs();
        sessionStorage.setItem('tipo_costo', this._tipoCosto);
        this._fechaAct.toString().slice(0, 8);
    };
    TransferenciabodComponent.prototype.transferir = function (a) {
        console.log(a);
        var modelCab = {
            T_llave: sessionStorage.getItem('Session-Key'),
            tempo: 'transferencia',
            tipo: sessionStorage.getItem('tipos-trans'),
            fecha_tra: this.modifyDate(),
            bodega: sessionStorage.getItem('cod_bod_transfer'),
            bodega_d: sessionStorage.getItem('cod_bod_transfer_d'),
            usercla: sessionStorage.getItem('Token-User'),
            referencia: '',
            tipoCosto: sessionStorage.getItem('tipo_costo'),
            comenta: a
        };
        console.log(modelCab);
        if (this.cantSprod <= 0) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Necesitas por lo menos un producto ingresado en el detalle.'
            });
        }
        else {
            this._bodserB = '';
            this._cod = '';
            this._desc = '';
            this._pres = '';
            this._cnti = '';
            this._boolTableShow = false;
            this.boolBodOri = true;
            this._bodserBool = false;
            this.gpbod('0', this.modifyDate());
            this.gb.saveCab(modelCab).subscribe(function () {
                sweetalert2_1["default"].fire({
                    icon: 'success',
                    title: 'Bien!',
                    text: 'se ha transferido con éxito'
                });
            }, function () {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo ocurrió.'
                });
            });
            for (var n = 0; n < this.arrGenTransProd.length; n++) {
                var modelDetail = {
                    T_llave: sessionStorage.getItem('Session-Key'),
                    tempo: 'transferencia',
                    linea: this.count++,
                    no_parte: this.arrGenTransProd[n].codigo,
                    cantidad: this.arrGenTransProd[n].cantidad,
                    precio_u: 0.00,
                    precio_t: 0.00
                };
                this.saveDetalle(modelDetail);
            }
            console.log(sessionStorage.getItem('Session-Key'));
            this.reporteria();
        }
    };
    TransferenciabodComponent.prototype.graphicrep = function () {
        var _this = this;
        am4core.useTheme(animated_1["default"]);
        var idchart = document.getElementById('chartdiv');
        // console.log(idchart);   
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // 
        var data = [];
        this.gb.getGraphicGen().subscribe(function (graph) {
            _this.ArrSP_GRAFICAWEB = graph;
            for (var i = 0; i <= _this.ArrSP_GRAFICAWEB.length - 1; i++) {
                _this.bodegaGraph = _this.ArrSP_GRAFICAWEB[i].bodega;
                _this.stock = _this.ArrSP_GRAFICAWEB[i].stock;
                data.push({
                    country: _this.bodegaGraph,
                    visits: _this.stock
                });
                console.log(data);
            }
            chart.data = data;
        });
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "country";
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = -2000;
        valueAxis.max = 24000;
        valueAxis.strictMinMax = true;
        valueAxis.renderer.minGridDistance = 15;
        // valueAxis.fill = '#fff';
        // axis break
        var axisBreak = valueAxis.axisBreaks.create();
        axisBreak.startValue = 2100;
        axisBreak.endValue = 30000;
        axisBreak.breakSize = 0.012;
        // make break expand on hover
        var hoverState = axisBreak.states.create("hover");
        hoverState.properties.breakSize = 1;
        hoverState.properties.opacity = 0.1;
        hoverState.transitionDuration = 1500;
        axisBreak.defaultState.transitionDuration = 1000;
        //this is exactly the same, but with events
        axisBreak.events.on("over", function () {
            axisBreak.animate([{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }], 1500, am4core.ease.sinOut);
        });
        axisBreak.events.on("out", function () {
            axisBreak.animate([{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }], 1000, am4core.ease.quadOut);
        });
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "country";
        series.dataFields.valueY = "visits";
        series.columns.template.tooltipText = "Stock: {valueY.value}";
        series.columns.template.tooltipY = 0;
        series.columns.template.strokeOpacity = 0;
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
    };
    TransferenciabodComponent.prototype.reporteria = function () {
        var _this = this;
        var sliA, sliB;
        setTimeout(function () {
            _this.gb.exec(sessionStorage.getItem('Session-Key'), 'transferencia').subscribe(function (CODREPORT) {
                _this.comproba = CODREPORT[0].comproba;
                sliA = _this.comproba.slice(0, -8);
                sliB = _this.comproba.slice(2, 10);
            });
        }, 1000);
        setTimeout(function () {
            _this.report.getExecReport(sliA, sliB).subscribe(function (myreport) {
                _this.repoArr = myreport;
                _this.repoBool = true;
                console.log(_this.repoArr),
                    _this.bod_ori = _this.repoArr[0].bodega + ' / ' + _this.repoArr[0].bnombre;
                _this.bod_desti = _this.repoArr[0].bodega_d + ' / ' + _this.repoArr[0].bnombreD;
                _this.fech_emi = new Date();
                _this.us_cla = _this.repoArr[0].usercla;
                _this._observerrep = _this.repoArr[0].comenta;
                _this._numero = _this.repoArr[0].numero2;
                _this._tipoTran = _this.repoArr[0].tipo;
                _this.fech_tran = _this.repoArr[0].fecha_tra;
            });
        }, 2000);
    };
    TransferenciabodComponent.prototype.saveDetalle = function (modelDetail) {
        var _this = this;
        this.gb.saveDet(modelDetail).subscribe(function () {
            _this.getTransProd();
        }, function () {
            console.log('ups algo ha ocurrido siguele ya mismo lo consigues');
        });
    };
    TransferenciabodComponent.prototype.getTransacs = function () {
        var _this = this;
        this.gb.getTransacProd().subscribe(function (TRANS) {
            _this.arrTransac = TRANS;
            console.log(TRANS);
        });
    };
    TransferenciabodComponent.prototype.gTrans = function (a, b) {
        this._transaccion = a;
        this.codTransac = b;
        sessionStorage.setItem('tipos-trans', this.codTransac);
    };
    TransferenciabodComponent.prototype.gBodegas = function (filter) {
        var _this = this;
        this.gb.getBodegas(filter).subscribe(function (bodegas) {
            _this.arrBodegas = bodegas;
        });
    };
    TransferenciabodComponent.prototype.getCodecBodegaA = function (a, b) {
        this._bodser = a + ' / ' + b;
        this.x = a;
        this.boolBodegas = false;
        localStorage.setItem('BodegaIngreso', this._bodser);
        sessionStorage.setItem('cod_bod_transfer', a);
        return this._bodser;
    };
    TransferenciabodComponent.prototype.getCodecBodegaB = function (a, b) {
        this._bodserB = a + ' / ' + b;
        this.boolBodegasB = false;
        localStorage.setItem('BodegaSalida', this._bodserB);
        sessionStorage.setItem('cod_bod_transfer_d', a);
        // console.log(sessionStorage.getItem('cod_bod_transfer_d'))
        return this._bodserB;
    };
    TransferenciabodComponent.prototype.controlBodRep = function () {
        if (localStorage.getItem('BodegaIngreso') != localStorage.getItem('BodegaSalida')) {
            return;
        }
        else {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puedes seleccionar las mismas bodegas al mismo tiempo'
            });
            this._bodser = '------';
            this._bodserB = '------';
        }
    };
    TransferenciabodComponent.prototype.comprobateBodega = function () {
        if ((this._bodser == undefined || this._bodserB == undefined) || (this._bodser == '------' || this._bodserB == '------') || (this._transaccion == undefined)) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Oops...',
                html: 'Estos 3 Campos deben estar llenos: <br> ' + 'Transacción <br>' + 'Bodega de Entrada <br>' + 'Bodega de Salida'
            });
        }
        else {
            this._boolTableShow = true;
            this._bodserBool = true;
            this.boolBodOri = false;
        }
    };
    TransferenciabodComponent.prototype.gpbod = function (bodega, date) {
        var _this = this;
        this.gb.getProdBod(bodega, date).subscribe(function (pbod) {
            _this.prodBodArr = pbod;
            console.log(_this.prodBodArr);
            _this.cantProdBod = _this.prodBodArr.length;
            if (_this.prodBodArr.length == 0) {
                sweetalert2_1["default"].fire({
                    icon: 'info',
                    title: 'No tienes productos cargados en esta bodega'
                });
            }
        }, function () {
            // alert('Algo ha ocurrido!');
        });
    };
    TransferenciabodComponent.prototype.modifyDate = function () {
        var date = new Date();
        var formatingStringConverter = date.toString();
        var formatingSlice = formatingStringConverter.slice(4, -36);
        var formatingReplace = formatingSlice.replace(/ /g, "-");
        return formatingReplace;
    };
    TransferenciabodComponent.prototype.searchProd = function (a) {
        this.gpbod(a, this.modifyDate());
    };
    TransferenciabodComponent.prototype.getCodec = function () {
        this._boolLift = true;
        this._codProd = this.x;
    };
    //_boolTableShow = !_boolTableShow
    TransferenciabodComponent.prototype.activateBodIngreso = function () {
        if (this.arrGenTransProd.length > 0) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Debes terminar la transacción!',
                text: ''
            });
        }
        else {
            this._boolTableShow = false;
            // this._boolLift = false;
            this.boolBodOri = true;
            this._bodserBool = false;
        }
    };
    TransferenciabodComponent.prototype.getReport = function () {
        this.reporteria();
    };
    TransferenciabodComponent.prototype.upProduct = function (a, b, c, d) {
        if (d <= 0) {
            sweetalert2_1["default"].fire({
                icon: 'info', title: 'Oops..!', text: 'No puedes escojer un producto sin stock'
            });
        }
        else {
            localStorage.setItem('no_parte-trans', a);
            localStorage.setItem('nombre-trans', b);
            localStorage.setItem('presentacion-trans', c);
            localStorage.setItem('stock-trans', d);
            this._cod = a;
            this._desc = b;
            this._pres = c;
            this._STCK = localStorage.getItem('stock-trans');
            //this._cant  = d;
        }
    };
    TransferenciabodComponent.prototype.validateCantidad = function (a) {
        if (this._cnti <= localStorage.getItem('stock-trans')) {
            localStorage.setItem('cant-transfer', a);
            this.calc = Number(localStorage.getItem('stock-trans')) - Number(localStorage.getItem('cant-transfer'));
            localStorage.setItem('difer-stock', this.calc.toString());
        }
        else if (this._cnti > localStorage.getItem('stock-trans')) {
            sweetalert2_1["default"].fire({
                icon: 'info', title: 'LLegaste al límite'
            });
            this._cnti = localStorage.getItem('stock-trans');
            localStorage.setItem('cant-transfer', localStorage.getItem('stock-trans'));
        }
    };
    TransferenciabodComponent.prototype.validateNegative = function (id, opt) {
        if (Number(localStorage.getItem('stock-trans')) < 0) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'No podemos agregar este producto al detalle, con stock negativo'
            });
        }
        else if (this._cnti <= 0) {
            sweetalert2_1["default"].fire({
                icon: 'error', title: 'Oops!', text: 'Debes ingresar cantidad mayor a 0'
            });
            this._cnti = 0;
        }
        else if ((this._cod == undefined || this._cod == '') ||
            (this._desc == undefined || this._desc == '') ||
            (this._pres == undefined || this._pres == '')) {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'No podemos agregar este producto al detalle, tienes campos vacíos'
            });
        }
        else {
            switch (opt) {
                case 'a':
                    this.postTransProd();
                    break;
                case 'b':
                    this.updateTransProd(id);
                    break;
            }
        }
    };
    TransferenciabodComponent.prototype.getNewCant = function (a, b) {
        this.boolUp = true;
        this.codigo = a;
        this.IDUP = b;
        localStorage.setItem('id-transfer', this.IDUP.toString());
    };
    TransferenciabodComponent.prototype.updateTransProd = function (id) {
        var _this = this;
        this.modelTPtod = {
            id: id,
            bodega_ing: this.x,
            codigo: this._cod,
            descripcion: this._desc,
            presentacion: this._pres,
            difer_stcok: this.calc,
            stock: Number(localStorage.getItem('stock-trans')),
            cantidad: this._cnti
        };
        this.gb.updateProdBod(id, this.modelTPtod).subscribe(function (update) {
            console.log(update);
            sweetalert2_1["default"].fire({
                icon: 'success',
                title: 'Editado!',
                text: 'La cantidad se ha editado con éxito'
            });
            _this.getTransProd();
        }, function () {
            sweetalert2_1["default"].fire({
                icon: 'error',
                title: 'Opps!',
                text: 'La cantidad no se ha editado con éxito'
            });
        });
    };
    TransferenciabodComponent.prototype.diferStockCal = function (a, b) {
        var calc = a - b;
        return calc;
    };
    TransferenciabodComponent.prototype.postTransProd = function () {
        var _this = this;
        this.modelTPtod = {
            bodega_ing: this.x,
            codigo: this._cod,
            descripcion: this._desc,
            presentacion: this._pres,
            difer_stcok: this.calc,
            stock: Number(localStorage.getItem('stock-trans')),
            cantidad: this._cnti
        };
        // console.log(this.modelTPtod);
        this.gb.saveProdBod(this.modelTPtod).subscribe(function (sprod) {
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Generado!',
            // })
            // console.log('==========HTTP RESPONSE==========');
            // console.log(sprod);
            // console.log(this.calc);
            _this.getTransProd();
        }, function (err) {
            sweetalert2_1["default"].fire({
                icon: 'info',
                title: 'Este producto ya fue agregado'
            });
        });
    };
    TransferenciabodComponent.prototype.delTransProd = function (id) {
        var _this = this;
        this.gb.delProdBod(id).subscribe(function (del) {
            sweetalert2_1["default"].fire({
                icon: 'success',
                title: 'Eliminado!',
                text: 'Este producto se ha eliminado con éxito'
            });
            _this.getTransProd();
        });
    };
    TransferenciabodComponent.prototype.getTransProd = function () {
        var _this = this;
        this.gb.genProdBod().subscribe(function (x) {
            _this.arrGenTransProd = x;
            // console.log('QUIERO VER EL STOCK');
            console.log(_this.arrGenTransProd);
            _this.cantSprod = _this.arrGenTransProd.length;
        });
    };
    TransferenciabodComponent = __decorate([
        core_1.Component({
            selector: 'app-transferenciabod',
            templateUrl: './transferenciabod.component.html',
            styleUrls: ['./transferenciabod.component.styl']
        })
    ], TransferenciabodComponent);
    return TransferenciabodComponent;
}());
exports.TransferenciabodComponent = TransferenciabodComponent;
