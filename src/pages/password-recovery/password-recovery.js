var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
// import {, AbstractControl} from '@angular/common';
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../providers/validation';
import { MikiPersonService } from '../../providers/miki-person';
var PasswordRecovery = /** @class */ (function () {
    function PasswordRecovery(toastCtrl, mikiPerson) {
        this.toastCtrl = toastCtrl;
        this.mikiPerson = mikiPerson;
        this.authForm = new FormGroup({
            email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
            password: new FormControl('', Validators.required)
        });
    }
    PasswordRecovery.prototype.onSubmit = function (value) {
        var _this = this;
        if (this.authForm.valid) {
            this.mikiPerson.testConnection(value.email, value.password).then(function (data) {
                // si erreur
                if (data == false) {
                    var toast = _this.toastCtrl.create({
                        message: "Échec lors de l'authentification.\n\rVeuillez contrôler votre nom d'utilisateur et votre mot de passe.",
                        duration: 3000
                    });
                    toast.present();
                }
            });
        }
    };
    PasswordRecovery = __decorate([
        Component({
            templateUrl: 'password-recovery.html',
            selector: 'password-recovery'
        }),
        __metadata("design:paramtypes", [ToastController, MikiPersonService])
    ], PasswordRecovery);
    return PasswordRecovery;
}());
export { PasswordRecovery };
//# sourceMappingURL=password-recovery.js.map