var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToastController, Events, } from 'ionic-angular';
import { Component } from '@angular/core';
// import {AbstractControl} from '@angular/common';
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../providers/validation';
import { MikiPersonService } from '../../providers/miki-person';
import { MikiPubliciteService } from '../../providers/miki-publicite';
var AccountCreate = /** @class */ (function () {
    function AccountCreate(mikiPerson, mikiPublicite, events, toastCtrl) {
        this.mikiPerson = mikiPerson;
        this.mikiPublicite = mikiPublicite;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.formSubmitedInvalid = false;
        this.createAccountForm = new FormGroup({
            lastname: new FormControl('', Validators.required),
            firstname: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
            passwords: new FormGroup({
                password: new FormControl('', Validators.required),
                password2: new FormControl('', Validators.required)
            }, ValidationService.passwordConfirmationValidator),
            createAccountConditions: new FormControl(false, ValidationService.checkboxValidator)
        });
    }
    AccountCreate.prototype.onSubmit = function (value) {
        var _this = this;
        console.log(this.createAccountForm);
        if (this.createAccountForm.valid) {
            // créé le compte utilisateur
            this.mikiPerson.createAccount(value).then(function (data) {
                if (data.result == 1) {
                    _this.events.publish('account:created');
                    var toast = _this.toastCtrl.create({
                        message: 'Création de compte réussie',
                        duration: 3000
                    });
                    toast.onDidDismiss(function () {
                        _this.events.publish('account:createdOk');
                    });
                    toast.present();
                }
                else {
                    var toast = _this.toastCtrl.create({
                        message: 'Erreur lors de la création du compte : ' + data.error,
                        duration: 3000
                    });
                    toast.onDidDismiss(function () {
                        // this.events.publish('account:created');
                    });
                    toast.present();
                }
            });
        }
        else {
            this.formSubmitedInvalid = true;
        }
    };
    // affiche les modalités pratiques
    AccountCreate.prototype.openConditions = function () {
        var _this = this;
        var pageName = 'conditions_utilisation_compte';
        this.http.get('http://es-asur.ch/api/index.php/page/' + pageName).subscribe(function (data) {
            var modal = _this.modalCtrl.create(Modalites, {
                title: "Conditions d'utilisation",
                text: data.json().content
            });
            modal.present();
        }, function (err) {
            console.log('error', err);
        } /*,
        () => console.log('Authentication Complete')*/);
    };
    AccountCreate = __decorate([
        Component({
            templateUrl: 'account-create.html',
            selector: 'account-create',
        }),
        __metadata("design:paramtypes", [MikiPersonService, MikiPubliciteService, Events, ToastController])
    ], AccountCreate);
    return AccountCreate;
}());
export { AccountCreate };
//# sourceMappingURL=account-create.js.map