var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
var MikiDocumentsService = /** @class */ (function () {
    function MikiDocumentsService(http) {
        this.http = http;
        this.documents = false;
        this.init();
    }
    MikiDocumentsService.prototype.init = function () {
        var _this = this;
        // si on a déjà récupéré l'info une fois on ne va pas la rechercher une seconde fois
        if (this.documents) {
            return Promise.resolve(this.documents);
        }
        // sinon on va la rechercher dans le stockage
        return new Promise(function (resolve, reject) {
            _this.getDocuments().then(function (data) {
                resolve(_this.documents);
            });
        });
    };
    /**
     * Récupère les events. Permet de définir l'id de la catégorie à récupérer. Si vide, récupert tous les events
     */
    MikiDocumentsService.prototype.getDocuments = function (idCategory) {
        var _this = this;
        // retourne une promise
        return new Promise(function (resolve, reject) {
            if (idCategory != undefined && idCategory != '') {
                _this.http.get('http://es-asur.ch/api/index.php/documents/' + idCategory).subscribe(function (data) {
                    _this.documents = Array();
                    _this.documents[idCategory] = data.json().documents;
                    resolve(_this.documents);
                }, function (err) {
                    resolve(false);
                } /*,
                () => console.log('Authentication Complete')*/);
            }
            else {
                _this.http.get('http://es-asur.ch/api/index.php/documents/').subscribe(function (data) {
                    var documents = data.json().documents;
                    if (_this.documents == false) {
                        _this.documents = Array();
                    }
                    for (var _i = 0, documents_1 = documents; _i < documents_1.length; _i++) {
                        var doc = documents_1[_i];
                        if (_this.documents[doc.id_category] == undefined) {
                            _this.documents[doc.id_category] = Array();
                        }
                        _this.documents[doc.id_category].push(doc);
                    }
                    resolve(_this.documents);
                }, function (err) {
                    resolve(false);
                });
            }
        });
    };
    MikiDocumentsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], MikiDocumentsService);
    return MikiDocumentsService;
}());
export { MikiDocumentsService };
//# sourceMappingURL=miki-documents.js.map