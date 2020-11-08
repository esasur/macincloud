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
import { AccountEventsList1 } from '../account-events-list-1/account-events-list-1';
import { AccountEventsList2 } from '../account-events-list-2/account-events-list-2';
var AccountEventsList = /** @class */ (function () {
    function AccountEventsList(navParams) {
        this.navParams = navParams;
        this.user = false;
        this.tabParams = {};
        // récupert l'utilisateur connecté (passé en paramètres)
        if (this.navParams.get("user")) {
            this.user = this.navParams.get("user");
        }
        else {
            this.user = false;
        }
        // ajoute l'état de la connexion de l'utilisateur aux paramètres passés aux pages des tabs
        this.tabParams.user = this.user;
        // définit les tabs
        this.tab1 = AccountEventsList1;
        this.tab2 = AccountEventsList2;
    }
    AccountEventsList = __decorate([
        Component({
            templateUrl: 'account-events-list.html',
            selector: 'account-events-list'
        }),
        __metadata("design:paramtypes", [NavParams])
    ], AccountEventsList);
    return AccountEventsList;
}());
export { AccountEventsList };
//# sourceMappingURL=account-events-list.js.map