var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AlertController, Events, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
// import {FormControl, FormGroup, Validators} from '@angular/forms';
import { EventsList } from '../events-list/events-list';
import { Login } from '../login/login';
import { AccountCreate } from '../account-create/account-create';
import { AccountEdit } from '../account-edit/account-edit';
import { PubliciteHome } from '../publicite-home/publicite-home';
import { MikiPersonService } from '../../providers/miki-person';
import { MikiPubliciteService } from '../../providers/miki-publicite';
var Accueil = /** @class */ (function () {
    function Accueil(nav, alertCtrl, events, mikiPerson, mikiPublicite) {
        var _this = this;
        this.nav = nav;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.mikiPerson = mikiPerson;
        this.mikiPublicite = mikiPublicite;
        // private user: boolean = false;
        this.loginPage = Login;
        this.createAccountPage = AccountCreate;
        this.accountEdit = AccountEdit;
        // private accountEventsList: any = AccountEventsList;
        this.EventsList = EventsList;
        // vérifie si un utilisateur est connecté
        this.mikiPerson.checkConnection();
        // lorsqu'une personne est authentifiée
        this.events.subscribe('user:login', function () {
            _this.mikiPerson.refreshUser();
        });
        // lorsqu'un compte utilisateur est modifié
        this.events.subscribe('account:updated', function () {
            // rafraichit l'utilisateur puis ouvre une page
            _this.mikiPerson.refreshUser();
        });
    }
    // décnnection
    Accueil.prototype.disconnect = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Déconnection',
            message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            buttons: [
                {
                    text: 'Oui',
                    handler: function () {
                        _this.mikiPerson.disconnect();
                    }
                },
                {
                    text: 'Non',
                    handler: function () { }
                }
            ]
        });
        confirm.present();
    };
    Accueil.prototype.goto = function (number) {
        switch (number) {
            case 1:
                // formation continue
                // si des publicités sont configurées on les affiche
                if (this.mikiPublicite.publicites != undefined && this.mikiPublicite.publicites.fc_home.length > 0) {
                    this.nav.push(PubliciteHome, { pubType: 'fc_home', user: this.mikiPerson.user });
                }
                else {
                    this.nav.push(this.EventsList, { idCategory: 1, user: this.mikiPerson.user });
                }
                break;
            case 2:
                // 1ers secours
                // si des publicités sont configurées on les affiche
                if (this.mikiPublicite.publicites != undefined && this.mikiPublicite.publicites.ps_home.length > 0) {
                    this.nav.push(PubliciteHome, { pubType: 'ps_home', user: this.mikiPerson.user });
                }
                else {
                    this.nav.push(this.EventsList, { idCategory: 15, user: this.mikiPerson.user });
                }
                break;
            case 3:
                // login
                this.nav.push(this.loginPage, { user: this.mikiPerson.user });
                break;
            case 4:
                // création d'un compte utilisateur
                this.nav.push(this.createAccountPage, { user: this.mikiPerson.user });
                break;
            case 5:
                // mon compte
                this.nav.push(this.accountEdit, { user: this.mikiPerson.user });
                break;
            case 6:
                // déconnexion
                this.disconnect();
                break;
        }
    };
    Accueil = __decorate([
        Component({
            templateUrl: 'accueil.html',
            selector: 'accueil',
        }),
        __metadata("design:paramtypes", [NavController, AlertController, Events, MikiPersonService, MikiPubliciteService])
    ], Accueil);
    return Accueil;
}());
export { Accueil };
//# sourceMappingURL=accueil.js.map