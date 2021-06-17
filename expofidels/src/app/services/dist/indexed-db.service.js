"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.IndexedDBService = void 0;
var core_1 = require("@angular/core");
var IndexedDBService = /** @class */ (function () {
    function IndexedDBService() {
    }
    IndexedDBService.prototype.createIndexedDB = function (databaseName, tagNumberVersion) {
        var db;
        var request = indexedDB.open(databaseName, tagNumberVersion);
        request.onerror = function (error) { return console.log(error); };
        request.onsuccess = function () {
            var transaction = db.transaction([databaseName], 'readwrite');
            transaction.objectStore(databaseName);
        };
        request.onupgradeneeded = function () {
            db = request.result;
            db.createObjectStore(databaseName, {
                autoIncrement: true
            });
        };
    };
    IndexedDBService.prototype.saveDataIndexedDB = function (databaseName, tagNumberVersion, data) {
        var db;
        var request = indexedDB.open(databaseName, tagNumberVersion);
        request.onerror = function (error) { return console.log(error); };
        request.onsuccess = function () {
            db = request.result;
            var transaction = db.transaction([databaseName], 'readwrite');
            var objectStore = transaction.objectStore(databaseName);
            objectStore.add(data);
        };
    };
    IndexedDBService.prototype.elBDData = function (databaseName) {
        return indexedDB.deleteDatabase(databaseName);
    };
    IndexedDBService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], IndexedDBService);
    return IndexedDBService;
}());
exports.IndexedDBService = IndexedDBService;
