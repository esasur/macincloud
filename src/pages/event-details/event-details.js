var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NavParams, LoadingController, Events, Tabs } from 'ionic-angular';
import { Component } from '@angular/core';
import { MikiEventsService } from '../../providers/miki-events';
import { EventDetails1 } from '../event-details-1/event-details-1';
import { EventDetails2 } from '../event-details-2/event-details-2';
import { EventDetails3 } from '../event-details-3/event-details-3';
import { ViewChild } from '@angular/core';
var EventDetails = /** @class */ (function () {
    function EventDetails(events, loadingCtrl, navParams, e) {
        var _this = this;
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.e = e;
        this.eventReady = false;
        this.user = false;
        this.tabParams = {};
        this.presentLoading();
        // lorsqu'une inscription a eu lieu, on affiche le premier onglet
        this.e.subscribe('event:subscribed', function () {
            _this.tabRef.select(0);
        });
        // récupert l'event à afficher
        this.event = this.navParams.get('event');
        // récupert l'utilisateur connecté (passé en paramètres)
        if (this.navParams.get("user")) {
            this.user = this.navParams.get("user");
        }
        else {
            this.user = false;
        }
        // ajoute l'état de la connexion de l'utilisateur aux paramètres passés aux pages des tabs
        this.tabParams.user = this.user;
        // récupert les données de l'event
        this.events.getEvent(this.event.id).subscribe(function (data) {
            _this.myEvent = data.json().event;
            // ajoute l'event aux paramètres passés aux pages des tabs
            _this.tabParams.myEvent = _this.myEvent;
            // puis récupert les informations dont on a besoin
            _this.eventTitle = _this.myEvent.title.fr;
            // définit les tabs
            _this.tab1 = EventDetails1;
            _this.tab2 = EventDetails2;
            // si l'event est à venir (s'il n'a pas déjà eu lieu) on affiche le tab d'inscription
            if (_this.event.futur) {
                _this.tab3 = EventDetails3;
            }
            // dit que l'event est chargé
            _this.eventReady = true;
        }, function (err) { return console.error(err); }, function () {
            _this.loading.dismiss();
        });
    }
    EventDetails.prototype.presentLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: "Veuillez patienter..."
        });
        this.loading.present();
    };
    __decorate([
        ViewChild('myTabs'),
        __metadata("design:type", Tabs)
    ], EventDetails.prototype, "tabRef", void 0);
    EventDetails = __decorate([
        Component({
            templateUrl: 'event-details.html',
            selector: 'event-details',
        }),
        __metadata("design:paramtypes", [MikiEventsService, LoadingController, NavParams, Events])
    ], EventDetails);
    return EventDetails;
}());
export { EventDetails };
//# sourceMappingURL=event-details.js.map