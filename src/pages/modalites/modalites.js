var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
// modal pour les modalités
var Modalites = /** @class */ (function () {
    function Modalites(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.title = '';
        this.text = '';
        this.title = this.params.get('title');
        this.text = this.params.get('text');
    }
    Modalites.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    Modalites = __decorate([
        Component({
            templateUrl: 'modalites.html',
            selector: 'modalites',
        }),
        __metadata("design:paramtypes", [ViewController, NavParams])
    ], Modalites);
    return Modalites;
}());
export { Modalites };
//# sourceMappingURL=modalites.js.map