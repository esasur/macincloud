var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
// import { Platform, NavController } from 'ionic-angular';
import { App, NavController, Platform, MenuController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
// import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { AccountCreate } from '../pages/account-create/account-create';
import { EventsList } from '../pages/events-list/events-list';
import { AccountEdit } from '../pages/account-edit/account-edit';
import { AccountEventsList } from '../pages/account-events-list/account-events-list';
import { Documents } from '../pages/documents/documents';
import { Accueil } from '../pages/accueil/accueil';
import { PubliciteHome } from '../pages/publicite-home/publicite-home';
import { MikiPersonService } from '../providers/miki-person';
import { MikiPubliciteService } from '../providers/miki-publicite';
import { EventsList1 } from '../pages/events-list-1/events-list-1';
import { EventsList2 } from '../pages/events-list-2/events-list-2';
// @Component({
//   templateUrl: 'app.html'
// })
// export class MyApp {
//   rootPage:any = TabsPage;
//   constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
//     platform.ready().then(() => {
//       // Okay, so the platform is ready and our plugins are available.
//       // Here you can do any higher level native things you might need.
//       statusBar.styleDefault();
//       splashScreen.hide();
//     });
//   }
// }
var MyApp = /** @class */ (function () {
    function MyApp(app, platform, menu, events, mikiPerson, mikiPublicite, alertCtrl, statusBar, push) {
        var _this = this;
        this.app = app;
        this.platform = platform;
        this.menu = menu;
        this.events = events;
        this.mikiPerson = mikiPerson;
        this.mikiPublicite = mikiPublicite;
        this.alertCtrl = alertCtrl;
        this.statusBar = statusBar;
        this.push = push;
        this.rootPage = PubliciteHome;
        this.accueilPage = Accueil;
        this.loginPage = Login;
        this.CreateAccountPage = AccountCreate;
        this.accountEdit = AccountEdit;
        this.accountEventsList = AccountEventsList;
        this.EventsList = EventsList;
        this.Documents = Documents;
        this.pushToken = '';
        // user: any = false;  // peut être FALSE ou un objet représentant la personne connectée
        this.eventsList_1 = EventsList1;
        this.eventsList_2 = EventsList2;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.statusBar.overlaysWebView(false);
            // initialise le stockage local
            // this.local = new Storage(LocalStorage);
            // récupert les publicités et lance le slide
            _this.mikiPublicite.refresh().then(function (data) {
                // vérifie si une publicité existe bien pour le départ
                if (mikiPublicite.publicites['start'].length > 0) {
                    mikiPublicite.start('top');
                    // this.events.publish('publicites:loaded');
                    // let nav = this.app.getComponent('nav');
                    _this.app.getRootNav().setRoot(PubliciteHome, { pubType: 'start', user: _this.mikiPerson.user });
                }
                else {
                    _this.app.getRootNav().setRoot(Accueil);
                }
            });
            // this.checkConnection();
            _this.mikiPerson.checkConnection().then(function (data) {
                // si un utilisateur est authentifié et que le token est déjà enregistré, on met à jour le token de l'utilisateur
                if (data !== false && _this.mikiPerson.user) {
                    _this.mikiPerson.setPushToken(_this.pushToken);
                }
            });
            // lorsqu'une publicité est fermée
            _this.events.subscribe('homePublicite:closed', function (pubType) {
                if (pubType == 'start') {
                    _this.app.getRootNav().setRoot(Accueil);
                }
                else if (pubType == 'fc_home') {
                    _this.app.getRootNav().setRoot(EventsList, { idCategory: 1, user: _this.mikiPerson.user });
                }
                else if (pubType == 'ps_home') {
                    _this.app.getRootNav().setRoot(EventsList, { idCategory: 15, user: _this.mikiPerson.user });
                }
            });
            // lorsqu'une personne est authentifiée
            _this.events.subscribe('user:login', function () {
                // rafraichit l'utilisateur puis ouvre une page
                _this.mikiPerson.refreshUser().then(function (data) {
                    _this.openPage(Accueil);
                });
                // et ajoute le token pour les notifications à l'utilisateur
                _this.mikiPerson.setPushToken(_this.pushToken);
            });
            // lorsqu'une personne est déconnectée
            _this.events.subscribe('user:logout', function () {
                // console.log('logout');
                // this.mikiPerson = false;
                // rafraichit l'utilisateur puis ouvre une page
                _this.mikiPerson.refreshUser().then(function (data) {
                    _this.openPage(Accueil);
                });
            });
            // lorsqu'un compte utilisateur est créé
            _this.events.subscribe('account:created', function () {
                // rafraichit l'utilisateur
                _this.mikiPerson.refreshUser();
            });
            // lorsqu'un compte utilisateur est créé et qu'on a clické sur "OK"
            _this.events.subscribe('account:createdOk', function () {
                // ouvre une page
                _this.openPage(AccountEdit);
            });
            // lorsqu'un compte utilisateur est modifié
            _this.events.subscribe('account:updated', function () {
                // rafraichit l'utilisateur puis ouvre une page
                _this.mikiPerson.refreshUser();
            });
            // enregistre l'application pour la réception de notifications Push
            var myPush = _this.push.init({
                android: {},
                ios: {
                    alert: "true",
                    badge: true,
                    sound: 'true'
                },
                windows: {}
            });
            if (myPush != undefined) {
                myPush.on('registration').subscribe(function (data) {
                    // sauvegarde le token
                    _this.pushToken = data.registrationId;
                    // si un utilisateur est authentifié, on met à jour son token
                    if (_this.mikiPerson.user) {
                        _this.mikiPerson.setPushToken(_this.pushToken);
                    }
                });
                myPush.on('notification').subscribe(function (data) {
                    alert(data.message);
                    console.log(data.message);
                    console.log(data.title);
                    console.log(data.count);
                    console.log(data.sound);
                    console.log(data.image);
                    console.log(data.additionalData);
                });
                myPush.on('error').subscribe(function (error) {
                    console.log(error.message);
                });
            }
        });
        // fin de l'enregistrement pour la réception de notifications Push
    }
    MyApp.prototype.openPage = function (page) {
        // if (page == Accueil && nav.length() > 1){
        //   console.log('pop');
        //   nav.pop();
        // }
        // else{
        // console.log('setRoot');
        this.app.getRootNav().setRoot(page, { user: this.mikiPerson.user });
        // }
        this.menu.close();
    };
    // affiche la page des events. Permet de définir l'id de la catégorie à afficher. Si vide, affiche tous les events
    MyApp.prototype.openEvents = function (idCategory) {
        if (idCategory != undefined) {
            this.events.publish('eventCategory:changed', idCategory);
        }
        // on ouvre uniquement la page des events si elle n'est pas déjà affichée
        if (this.rootPage != this.EventsList) {
            // si la catégorie est fournie, on la passe à la page
            if (idCategory != undefined) {
                if (idCategory == 1) {
                    // si des publicités sont configurées on les affiche
                    if (this.mikiPublicite.publicites != undefined && this.mikiPublicite.publicites.fc_home.length > 0) {
                        this.nav.push(PubliciteHome, { pubType: 'fc_home', user: this.mikiPerson.user });
                    }
                    else {
                        this.nav.push(EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
                    }
                }
                else if (idCategory == 15) {
                    // si des publicités sont configurées on les affiche
                    if (this.mikiPublicite.publicites != undefined && this.mikiPublicite.publicites.ps_home.length > 0) {
                        this.nav.push(PubliciteHome, { pubType: 'ps_home', user: this.mikiPerson.user });
                    }
                    else {
                        this.nav.push(EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
                    }
                }
                // this.app.getRootNav().setRoot(EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
            }
            else {
                this.app.getRootNav().setRoot(EventsList, { user: this.mikiPerson.user });
            }
        }
        else {
            if (idCategory != undefined) {
                this.events.publish('eventCategory:changed', idCategory);
            }
        }
        this.menu.close();
    };
    // décnnection
    MyApp.prototype.disconnect = function () {
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
        this.menu.close();
        confirm.present();
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", NavController)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html',
        }),
        __metadata("design:paramtypes", [App, Platform, MenuController, Events, MikiPersonService, MikiPubliciteService, AlertController, StatusBar, Push])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map