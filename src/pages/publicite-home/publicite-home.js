var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Events, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { MikiPubliciteService } from '../../providers/miki-publicite';
var PubliciteHome = /** @class */ (function () {
    // private canPrintButton: boolean = false;
    function PubliciteHome(mikiPublicite, events, navParams) {
        this.mikiPublicite = mikiPublicite;
        this.events = events;
        this.navParams = navParams;
        this.pubType = '';
        this.printButton = false;
        // récupert le type de publicité à afficher (fc_home/ps_home pour "formation continue/premiers secours")
        if (this.navParams.data.pubType) {
            this.pubType = this.navParams.data.pubType;
            // si c'est la publicité de démarrage, affiche le bouton pour quitter la pub seulement après 3 secondes
            if (this.pubType == 'start') {
                this.printButton = false;
                var el = this;
                setTimeout(function () {
                    el.printButton = true;
                }, 4000);
            }
            else {
                this.printButton = true;
            }
        }
    }
    PubliciteHome.prototype.close = function () {
        this.events.publish('homePublicite:closed', this.pubType);
    };
    PubliciteHome = __decorate([
        Component({
            templateUrl: 'publicite-home.html',
            selector: 'publicite-home'
        }),
        __metadata("design:paramtypes", [MikiPubliciteService, Events, NavParams])
    ], PubliciteHome);
    return PubliciteHome;
}());
export { PubliciteHome };
//# sourceMappingURL=publicite-home.js.map