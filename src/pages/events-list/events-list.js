var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
// import {EventDetails} from '../event-details/event-details';
import { EventsList1 } from '../events-list-1/events-list-1';
import { EventsList2 } from '../events-list-2/events-list-2';
var EventsList = /** @class */ (function () {
    function EventsList(navParams) {
        this.navParams = navParams;
        this.user = false;
        this.tabParams = {};
        this.year = '';
        this.nextYear = '';
        // récupert l'utilisateur connecté (passé en paramètres)
        if (this.navParams.get("user")) {
            this.user = this.navParams.get("user");
        }
        else {
            this.user = false;
        }
        // ajoute l'état de la connexion de l'utilisateur aux paramètres passés aux pages des tabs
        this.tabParams.user = this.user;
        // passe l'id de la catégorie à afficher si donnée
        if (this.navParams.get("idCategory")) {
            this.tabParams.idCategory = this.navParams.get("idCategory");
        }
        else {
            this.tabParams.idCategory = '';
        }
        this.year = new Date().getFullYear();
        this.nextYear = this.year + 1;
        // définit les tabs
        this.tab1 = EventsList1;
        this.tab2 = EventsList2;
    }
    EventsList = __decorate([
        Component({
            templateUrl: 'events-list.html',
            selector: 'events-list'
        }),
        __metadata("design:paramtypes", [NavParams])
    ], EventsList);
    return EventsList;
}());
export { EventsList };
//# sourceMappingURL=events-list.js.map