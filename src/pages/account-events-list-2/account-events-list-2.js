var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { EventDetails } from '../event-details/event-details';
import { MikiEventsService } from '../../providers/miki-events';
var AccountEventsList2 = /** @class */ (function () {
    function AccountEventsList2(events, loadingCtrl, navParams, nav) {
        // this.presentLoading();
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.nav = nav;
        this.foundEvents = [];
        this.search = '';
        this.user = false;
        this.pageTitle = 'Formations';
        this.idCategory = '';
        // affiche tous les events
        this.idCategory = '';
        // définit le titre de la page
        this.pageTitle = 'Formations prévues';
        // récupert l'utilisateur connecté (passé en paramètres)
        if (this.navParams.get("user")) {
            this.user = this.navParams.get("user");
        }
        else {
            this.user = false;
        }
    }
    AccountEventsList2.prototype.ionViewDidEnter = function () {
        // this.presentLoading();
        this.refrechEvents();
    };
    AccountEventsList2.prototype.presentLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: "Veuillez patienter..."
        });
        this.loading.present();
    };
    // récupert la liste des events depuis le site
    AccountEventsList2.prototype.refrechEvents = function () {
        var _this = this;
        if (this.user) {
            this.events.getEventsFromPerson(this.user.id, 3).subscribe(function (data) {
                _this.foundEvents = data.json().events;
                _this.allEvents = _this.foundEvents;
            }, function (err) { return console.error(err); }, function () {
                // this.loading.dismiss();
            });
        }
        else {
            // this.loading.dismiss();
            console.log('non connecté !');
        }
    };
    // lors d'un clic sur un event
    AccountEventsList2.prototype.eventClick = function (event, item) {
        this.nav.push(EventDetails, {
            event: item,
            user: this.user
        });
    };
    // filtre les events
    AccountEventsList2.prototype.searchEvents = function () {
        var temp = [];
        var searchValue = this.search.toLowerCase();
        for (var _i = 0, _a = this.allEvents; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            if (event_1.title.fr.toLowerCase().indexOf(searchValue) != -1 || event_1.description.fr.toLowerCase().indexOf(searchValue) != -1) {
                temp.push(event_1);
            }
        }
        this.foundEvents = temp;
    };
    // action lors d'un refresh manuel (pull to refresh)
    AccountEventsList2.prototype.doRefresh = function (refresher) {
        var _this = this;
        if (this.user) {
            this.events.getEventsFromPerson(this.user.id, 3).subscribe(function (data) {
                _this.foundEvents = data.json().events;
                _this.allEvents = _this.foundEvents;
            }, function (err) {
                console.error(err);
            }, function () {
                refresher.complete();
            });
        }
        else {
            console.log('non connecté !');
        }
    };
    // réinitialise les events
    AccountEventsList2.prototype.clearSearchEvents = function () {
        this.foundEvents = this.allEvents;
    };
    AccountEventsList2 = __decorate([
        Component({
            templateUrl: 'account-events-list-2.html',
            selector: 'account-events-list-2'
        }),
        __metadata("design:paramtypes", [MikiEventsService, LoadingController, NavParams, NavController])
    ], AccountEventsList2);
    return AccountEventsList2;
}());
export { AccountEventsList2 };
//# sourceMappingURL=account-events-list-2.js.map