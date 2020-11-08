var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Platform, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { MikiDocumentsService } from '../../providers/miki-documents';
var DocumentsList = /** @class */ (function () {
    function DocumentsList(navParams, platform, mikiDocuments) {
        this.platform = platform;
        this.mikiDocuments = mikiDocuments;
        this.user = false;
        this.categoryId = 60;
        // récupert l'utilisateur connecté (passé en paramètres)
        if (navParams.get("user")) {
            this.user = navParams.get("user");
        }
        else {
            this.user = false;
        }
        this.categoryId = JSON.parse(navParams.data).categoryId;
    }
    // pour l'ouverture d'un document
    DocumentsList.prototype.openDoc = function (url) {
        if (this.platform.is('ios')) {
            window.open('http://es-asur.ch/' + url, '_blank', 'EnableViewPortScale=yes');
        }
        else {
            window.open('http://es-asur.ch/' + url, '_system', 'location=yes');
        }
    };
    DocumentsList = __decorate([
        Component({
            templateUrl: 'documents-list.html',
            selector: 'documents-list',
        }),
        __metadata("design:paramtypes", [NavParams, Platform, MikiDocumentsService])
    ], DocumentsList);
    return DocumentsList;
}());
export { DocumentsList };
//# sourceMappingURL=documents-list.js.map