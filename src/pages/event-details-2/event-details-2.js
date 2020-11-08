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
import { MikiPubliciteService } from '../../providers/miki-publicite';
var EventDetails2 = /** @class */ (function () {
    function EventDetails2(navParams, mikiPublicite) {
        this.navParams = navParams;
        this.mikiPublicite = mikiPublicite;
        this.user = false;
        this.eventDescription = '';
        // récupert l'event passé en paramètre
        this.myEvent = this.navParams.data.myEvent;
        // ainsi que l'état de la connexion de l'utilisateur
        this.user = this.navParams.data.user;
        // puis récupert les informations dont on a besoin
        this.eventDescription = this.myEvent.description.fr;
    }
    EventDetails2 = __decorate([
        Component({
            templateUrl: 'event-details-2.html',
            selector: 'event-details-2',
        }),
        __metadata("design:paramtypes", [NavParams, MikiPubliciteService])
    ], EventDetails2);
    return EventDetails2;
}());
export { EventDetails2 };
//# sourceMappingURL=event-details-2.js.map