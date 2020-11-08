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
var AccountEventsList1 = /** @class */ (function () {
    function AccountEventsList1(events, loadingCtrl, navParams, nav) {
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
        this.pageTitle = 'Formations suivies';
        // récupert l'utilisateur connecté (passé en paramètres)
        if (this.navParams.get("user")) {
            this.user = this.navParams.get("user");
        }
        else {
            this.user = false;
        }
    }
    AccountEventsList1.prototype.ionViewDidEnter = function () {
        // this.presentLoading();
        this.refrechEvents();
    };
    AccountEventsList1.prototype.presentLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: "Veuillez patienter..."
        });
        this.loading.present();
    };
    // récupert la liste des events depuis le site
    AccountEventsList1.prototype.refrechEvents = function () {
        var _this = this;
        if (this.user) {
            this.events.getEventsFromPerson(this.user.id, 2).subscribe(function (data) {
                _this.foundEvents = data.json().events;
                _this.allEvents = _this.foundEvents;
            }, function (err) { return console.error(err); }, function () {
                // this.loading.dismiss();
            });
        }
        else {
            // this.loading.dismiss();
        }
    };
    // lors d'un clic sur un event
    AccountEventsList1.prototype.eventClick = function (event, item) {
        this.nav.push(EventDetails, {
            event: item,
            user: this.user
        });
    };
    // filtre les events
    AccountEventsList1.prototype.searchEvents = function () {
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
    AccountEventsList1.prototype.doRefresh = function (refresher) {
        var _this = this;
        if (this.user) {
            this.events.getEventsFromPerson(this.user.id, 2).subscribe(function (data) {
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
    AccountEventsList1.prototype.clearSearchEvents = function () {
        this.foundEvents = this.allEvents;
    };
    AccountEventsList1 = __decorate([
        Component({
            templateUrl: 'account-events-list-1.html',
            selector: 'account-events-list-1'
        }),
        __metadata("design:paramtypes", [MikiEventsService, LoadingController, NavParams, NavController])
    ], AccountEventsList1);
    return AccountEventsList1;
}());
export { AccountEventsList1 };
//# sourceMappingURL=account-events-list-1.js.map