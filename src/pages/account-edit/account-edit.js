var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NavParams, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
// import {AbstractControl} from '@angular/common';  
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MikiPersonService } from '../../providers/miki-person';
import { MikiEventsService } from '../../providers/miki-events';
import { MikiPubliciteService } from '../../providers/miki-publicite';
import { ValidationService } from '../../providers/validation';
var AccountEdit = /** @class */ (function () {
    function AccountEdit(mikiPerson, mikiEvents, mikiPublicite, events, alertCtrl, loadingCtrl, navParams, toastCtrl) {
        var _this = this;
        this.mikiPerson = mikiPerson;
        this.mikiEvents = mikiEvents;
        this.mikiPublicite = mikiPublicite;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.user = false;
        this.codesPros = [];
        this.countries = [];
        this.days = [];
        this.months = [];
        this.years = [];
        // récupert l'utilisateur connecté (passé en paramètres)
        if (this.navParams.get("user")) {
            this.user = this.navParams.get("user");
        }
        else {
            this.user = false;
        }
        // initialise le forumlaire
        this.initForm();
        // récupert la liste des codes professionnels
        this.mikiEvents.getCodesPros().subscribe(function (data) {
            var codes = data.json().codes;
            _this.codesPros = codes;
            // recherche le nom du code profesionnel de l'utilisateur
            if (_this.user) {
                _this.user.company_code_name = '';
                for (var i = 0; i < codes.length; i++) {
                    if (codes[i].numero == _this.user.others.company_code) {
                        _this.user.company_code_name = codes[i].nom;
                    }
                }
            }
        }, function (err) { return console.error(err); }, function () { });
        // récupert la liste des pays
        this.mikiEvents.getCountries().subscribe(function (data) {
            _this.countries = data.json().countries;
            if (_this.user) {
                _this.user.countryName = '';
                _this.user.company.countryName = '';
            }
            var france_index = null;
            var suisse_index = null;
            // recherche le nom du pays de l'utilisateur et récupert la France et la Suisse
            for (var i = 0; i < _this.countries.length; i++) {
                if (_this.user) {
                    if (_this.countries[i].id == _this.user.country) {
                        _this.user.countryName = _this.countries[i].name.fr;
                    }
                    if (_this.countries[i].id == _this.user.company.country) {
                        _this.user.company.countryName = _this.countries[i].name.fr;
                    }
                }
                if (_this.countries[i].name.fr == 'France') {
                    france_index = i;
                }
                if (_this.countries[i].name.fr == 'Suisse') {
                    suisse_index = i;
                }
            }
            // place la Suisse et la France en début de tableau
            if (france_index != null) {
                var temp = _this.countries[france_index];
                _this.countries.splice(france_index, 1);
                _this.countries.unshift(temp);
            }
            if (suisse_index != null) {
                var temp = _this.countries[suisse_index];
                _this.countries.splice(suisse_index, 1);
                _this.countries.unshift(temp);
            }
        }, function (err) { return console.error(err); }, function () { });
    }
    // initialise le formulaire
    AccountEdit.prototype.initForm = function () {
        // prépare les données pour la date de naissance
        for (var i = 1; i <= 31; i++) {
            this.days.push(i);
        }
        this.months[1] = "Janvier";
        this.months[2] = "Février";
        this.months[3] = "Mars";
        this.months[4] = "Avril";
        this.months[5] = "Mai";
        this.months[6] = "Juin";
        this.months[7] = "Juillet";
        this.months[8] = "Août";
        this.months[9] = "Septembre";
        this.months[10] = "Octobre";
        this.months[11] = "Novembre";
        this.months[12] = "Décembre";
        var now = new Date();
        var yearNow = now.getFullYear();
        for (var i = yearNow - 10; i > yearNow - 100; i--) {
            this.years.push(i);
        }
        // récupert la date de naissance de l'utilisateur
        if (this.user) {
            // récupert la date de naissance de l'utilisateur
            this.userBirthdayArray = this.user.birthday.split('/');
            if (this.userBirthdayArray.length != 3) {
                this.userBirthdayArray = ['', '', ''];
            }
            this.accountEditForm = new FormGroup({
                type: new FormControl(this.user.type, Validators.required),
                lastname: new FormControl(this.user.lastname, Validators.required),
                firstname: new FormControl(this.user.firstname, Validators.required),
                birthday_day: new FormControl(this.userBirthdayArray[0], Validators.required),
                birthday_month: new FormControl(this.userBirthdayArray[1], Validators.required),
                birthday_year: new FormControl(this.userBirthdayArray[2], Validators.required),
                addressBillingType: new FormControl(this.user.others.type_adresse_facturation, Validators.required),
                addressMailingType: new FormControl(this.user.others.type_adresse_courrier, Validators.required),
                privateAddress: new FormControl(this.user.address, Validators.required),
                privateNpa: new FormControl(this.user.npa, Validators.required),
                privateCity: new FormControl(this.user.city, Validators.required),
                privateCountry: new FormControl(this.user.country, Validators.required),
                privateMobile: new FormControl(this.user.tel2, Validators.required),
                privateFixe: new FormControl(this.user.tel1),
                privateEmail: new FormControl(this.user.email1, [Validators.required, ValidationService.emailValidator]),
                proCompany: new FormControl(this.user.company.name, Validators.required),
                proCompanyCode: new FormControl(this.user.others.company_code, Validators.required),
                codeProOther: new FormControl(''),
                proAddress: new FormControl(this.user.company.address, Validators.required),
                proNpa: new FormControl(this.user.company.npa, Validators.required),
                proCity: new FormControl(this.user.company.city, Validators.required),
                proCountry: new FormControl(this.user.company.country, Validators.required),
                proTel: new FormControl(this.user.company.tel, Validators.required),
                proFax: new FormControl(this.user.company.fax),
                proEmail: new FormControl(this.user.company.email, [Validators.required, ValidationService.emailValidator]),
                passwords: new FormGroup({
                    password1: new FormControl(''),
                    password2: new FormControl('')
                }, ValidationService.passwordConfirmationValidator)
            });
        }
        else {
            this.accountEditForm = new FormGroup({
                type: new FormControl('', Validators.required),
                lastname: new FormControl('', Validators.required),
                firstname: new FormControl('', Validators.required),
                birthday_day: new FormControl('', Validators.required),
                birthday_month: new FormControl('', Validators.required),
                birthday_year: new FormControl('', Validators.required),
                addressBillingType: new FormControl('', Validators.required),
                addressMailingType: new FormControl('', Validators.required),
                privateAddress: new FormControl('', Validators.required),
                privateNpa: new FormControl('', Validators.required),
                privateCity: new FormControl('', Validators.required),
                privateCountry: new FormControl('', Validators.required),
                privateMobile: new FormControl('', Validators.required),
                privateFixe: new FormControl(''),
                privateEmail: new FormControl('', [Validators.required, ValidationService.emailValidator]),
                proCompany: new FormControl('', Validators.required),
                proCompanyCode: new FormControl('', Validators.required),
                codeProOther: new FormControl(''),
                proAddress: new FormControl('', Validators.required),
                proNpa: new FormControl('', Validators.required),
                proCity: new FormControl('', Validators.required),
                proCountry: new FormControl('', Validators.required),
                proTel: new FormControl('', Validators.required),
                proFax: new FormControl(''),
                proEmail: new FormControl('', [Validators.required, ValidationService.emailValidator]),
                passwords: new FormGroup({
                    password1: new FormControl(''),
                    password2: new FormControl('')
                }, ValidationService.passwordConfirmationValidator)
            });
        }
        // sélectionne la suisse par défaut
        for (var i = 0; i < this.countries.length; i++) {
            if (this.countries[i].name.fr == 'Suisse') {
                this.proCountry.updateValue(this.countries[i].id);
            }
        }
    };
    // teste si un tableau contient une valeur donnée
    AccountEdit.prototype.arrayContains = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    };
    AccountEdit.prototype.presentLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: "Veuillez patienter..."
        });
        this.loading.present();
    };
    AccountEdit.prototype.onSubmit = function (value) {
        var _this = this;
        if (this.accountEditForm.valid) {
            this.mikiPerson.editAccount(this.user.id, value).then(function (data) {
                if (data.result == 1) {
                    _this.events.publish('account:updated');
                    var toast = _this.toastCtrl.create({
                        cssClass: 'toast-success',
                        message: data.msg,
                        showCloseButton: true,
                        closeButtonText: 'Ok'
                    });
                    toast.present();
                }
                else if (data.result == 0) {
                    var toast = _this.toastCtrl.create({
                        cssClass: 'toast-error',
                        message: data.error,
                        showCloseButton: true,
                        closeButtonText: 'Ok'
                    });
                    toast.present();
                }
            });
        }
    };
    AccountEdit.prototype.deleteAccountConfim = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Suppression de compte',
            message: 'Etes-vous sûr de vouloir supprimer votre compte utilisateur ? Cette action est irrémédiable !',
            buttons: [
                {
                    text: 'Oui',
                    handler: function () {
                        confirm.dismiss();
                        _this.deleteAccount();
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
    AccountEdit.prototype.deleteAccount = function () {
        var _this = this;
        this.mikiPerson.deleteAccount(this.user.id).then(function (data) {
            if (data.result == 1) {
                // déconnecte l'utilisateur
                _this.mikiPerson.disconnect();
                var toast = _this.toastCtrl.create({
                    cssClass: 'toast-success',
                    message: data.msg,
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                });
                toast.onDidDismiss(function () {
                    // this.events.publish('account:created');
                });
                toast.present();
            }
            else if (data.result == 0) {
                var toast = _this.toastCtrl.create({
                    cssClass: 'toast-error',
                    message: data.error,
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                });
                toast.present();
            }
        });
    };
    AccountEdit = __decorate([
        Component({
            templateUrl: 'account-edit.html',
            selector: 'account-edit'
        }),
        __metadata("design:paramtypes", [MikiPersonService, MikiEventsService, MikiPubliciteService, Events, AlertController, LoadingController, NavParams, ToastController])
    ], AccountEdit);
    return AccountEdit;
}());
export { AccountEdit };
//# sourceMappingURL=account-edit.js.map