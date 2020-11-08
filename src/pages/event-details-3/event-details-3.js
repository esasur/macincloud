var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { App, NavParams, ToastController, ModalController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
// import {AbstractControl} from '@angular/common';
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MikiEventsService } from '../../providers/miki-events';
import { MikiPubliciteService } from '../../providers/miki-publicite';
import { ValidationService } from '../../providers/validation';
import { Modalites } from '../modalites/modalites';
import { Login } from '../login/login';
import { Http } from '@angular/http';
var EventDetails3 = /** @class */ (function () {
    function EventDetails3(app, toastCtrl, modalCtrl, navParams, events, mikiPublicite, http, e) {
        var _this = this;
        this.app = app;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.navParams = navParams;
        this.events = events;
        this.mikiPublicite = mikiPublicite;
        this.http = http;
        this.e = e;
        this.loginPage = Login;
        this.eventPrices = [];
        this.priceId = '';
        this.choosenPriceId = '';
        this.msgParticipants = '';
        this.accompanist = '';
        this.codeAutorises = '';
        this.eventSubscription = '';
        this.subscriptionState = 0;
        this.codesPros = [];
        this.countries = [];
        this.days = [];
        this.months = [];
        this.years = [];
        // récupert l'event passé en paramètre
        this.myEvent = this.navParams.data.myEvent;
        // ainsi que l'état de la connexion de l'utilisateur
        this.user = this.navParams.data.user;
        // puis récupert les informations dont on a besoin :
        // les prix de l'event
        for (var _i = 0, _a = this.myEvent.prices; _i < _a.length; _i++) {
            var myPrice = _a[_i];
            var priceName = myPrice.price;
            if (myPrice.title.fr != '') {
                priceName = myPrice.title.fr + ' - ' + priceName;
            }
            this.eventPrices.push({ id: myPrice.id, title: myPrice.title.fr, description: myPrice.description.fr, price: myPrice.price, priceName: priceName });
        }
        ;
        // le nombre max de participants ou de places restantes
        if (this.myEvent.max_participants == 0) {
            this.msgParticipants = "illimité";
        }
        else {
            this.msgParticipants = (this.myEvent.max_participants - this.myEvent.nb_participants) + " places restantes";
        }
        // le nombre d'accompagnants autorisés
        this.accompanist = this.myEvent.accompanist;
        // la liste des codes professionnels autorisés pour l'event
        if (this.myEvent.others.code_autorises && this.myEvent.others.code_autorises.trim() != '') {
            this.codeAutorises = this.myEvent.others.code_autorises.trim().split(',');
            for (var i = 0; i < this.codeAutorises.length; i++) {
                this.codeAutorises[i] = this.codeAutorises[i].trim();
            }
        }
        else {
            this.codeAutorises = "";
        }
        // la liste des codes professionnels
        this.events.getCodesPros().subscribe(function (data) {
            var codes = data.json().codes;
            // si il n'y a pas de restriction au niveau des codes professionnels on les permet tous
            if (_this.codeAutorises == '') {
                _this.codesPros = codes;
            }
            else {
                _this.codesPros = [];
                for (var i = 0; i < codes.length; i++) {
                    if (_this.arrayContains(_this.codeAutorises, codes[i].numero)) {
                        _this.codesPros.push(codes[i]);
                    }
                }
            }
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
        // la liste des pays
        this.events.getCountries().subscribe(function (data) {
            _this.countries = data.json().countries;
            if (_this.user) {
                _this.user.countryName = '';
                _this.user.company.countryName = '';
            }
            var france_index = null;
            var suisse_index = null;
            // recherche le nom du pays de l'utilisateur
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
        // si l'event est de type public ou privé
        if (this.myEvent.others.hasOwnProperty('public_type')) {
            this.eventPublicType = this.myEvent.others.public_type;
        }
        else {
            this.eventPublicType = 0;
        }
        // si l'utilisateur est connecté, on vérifie s'il est déjà inscrit à l'event
        if (this.user) {
            this.events.isSubscribed(this.myEvent.id, this.user.id).subscribe(function (data) {
                _this.subscriptionState = data.json().state;
                // met à jour l'affichage du formulaire d'inscription en fonction de différents paramètres
                _this.updateSubscriptionView();
            }, function (err) { return console.error(err); }, function () { });
        }
        // la configuration générale des inscriptions aux events
        this.eventSubscription = this.myEvent.event_subscription;
        // initialise le forumlaire
        this.initForm();
        // met à jour l'affichage du formulaire d'inscription en fonction de différents paramètres
        this.updateSubscriptionView();
    }
    // initialise le formulaire
    EventDetails3.prototype.initForm = function () {
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
            this.userBirthdayArray = this.user.birthday.split('/');
            if (this.userBirthdayArray.length != 3) {
                this.userBirthdayArray = ['', '', ''];
            }
            this.eventSubscribeForm = new FormGroup({
                subscriptionType: new FormControl(this.user.type, Validators.required),
                subscriptionLastname: new FormControl(this.user.lastname, Validators.required),
                subscriptionFirstname: new FormControl(this.user.firstname, Validators.required),
                subscriptionBirthday_day: new FormControl(this.userBirthdayArray[0], Validators.required),
                subscriptionBirthday_month: new FormControl(this.userBirthdayArray[1], Validators.required),
                subscriptionBirthday_year: new FormControl(this.userBirthdayArray[2], Validators.required),
                subscriptionAddressBillingType: new FormControl(this.user.others.type_adresse_facturation, Validators.required),
                subscriptionAddressMailingType: new FormControl(this.user.others.type_adresse_courrier, Validators.required),
                subscriptionPrivateAddress: new FormControl(this.user.address, Validators.required),
                subscriptionPrivateNpa: new FormControl(this.user.npa, Validators.required),
                subscriptionPrivateCity: new FormControl(this.user.city, Validators.required),
                subscriptionPrivateCountry: new FormControl(this.user.country, Validators.required),
                subscriptionPrivateMobile: new FormControl(this.user.tel2, Validators.required),
                subscriptionPrivateFixe: new FormControl(this.user.tel1),
                subscriptionPrivateEmail: new FormControl(this.user.email1, [Validators.required, ValidationService.emailValidator]),
                subscriptionProCompany: new FormControl(this.user.company.name, Validators.required),
                subscriptionProCompanyCode: new FormControl(this.user.others.company_code, Validators.required),
                subscriptionCodeProOther: new FormControl(''),
                subscriptionProAddress: new FormControl(this.user.company.address, Validators.required),
                subscriptionProNpa: new FormControl(this.user.company.npa, Validators.required),
                subscriptionProCity: new FormControl(this.user.company.city, Validators.required),
                subscriptionProCountry: new FormControl(this.user.company.country, Validators.required),
                subscriptionProTel: new FormControl(this.user.company.tel, Validators.required),
                subscriptionProFax: new FormControl(this.user.company.fax),
                subscriptionProEmail: new FormControl(this.user.company.email, [Validators.required, ValidationService.emailValidator]),
                subscriptionComment: new FormControl(this.user.subscriptionComment),
                subscriptionConditions: new FormControl(false, ValidationService.checkboxValidator)
            });
            // si l'inscription est payante, on rend obligatoire le choix du prix
            if (this.myEvent.entrance_type == 1) {
                this.eventSubscribeForm.addControl('subscriptionPriceId', new FormControl(this.eventPrices[0] != undefined ? this.eventPrices[0].id : '', Validators.required));
            }
        }
        else {
            this.eventSubscribeForm = new FormGroup({
                subscriptionPriceId: new FormControl('', Validators.required),
                subscriptionType: new FormControl('', Validators.required),
                subscriptionLastname: new FormControl('', Validators.required),
                subscriptionFirstname: new FormControl('', Validators.required),
                subscriptionBirthday_day: new FormControl('', Validators.required),
                subscriptionBirthday_month: new FormControl('', Validators.required),
                subscriptionBirthday_year: new FormControl('', Validators.required),
                subscriptionAddressBillingType: new FormControl('Choisir', Validators.required),
                subscriptionAddressMailingType: new FormControl('', Validators.required),
                subscriptionPrivateAddress: new FormControl('', Validators.required),
                subscriptionPrivateNpa: new FormControl('', Validators.required),
                subscriptionPrivateCity: new FormControl('', Validators.required),
                subscriptionPrivateCountry: new FormControl('', Validators.required),
                subscriptionPrivateMobile: new FormControl('', Validators.required),
                subscriptionPrivateFixe: new FormControl(''),
                subscriptionPrivateEmail: new FormControl('', [Validators.required, ValidationService.emailValidator]),
                subscriptionProCompany: new FormControl('', Validators.required),
                subscriptionProCompanyCode: new FormControl('', Validators.required),
                subscriptionCodeProOther: new FormControl(''),
                subscriptionProAddress: new FormControl('', Validators.required),
                subscriptionProNpa: new FormControl('', Validators.required),
                subscriptionProCity: new FormControl('', Validators.required),
                subscriptionProCountry: new FormControl('', Validators.required),
                subscriptionProTel: new FormControl('', Validators.required),
                subscriptionProFax: new FormControl(''),
                subscriptionProEmail: new FormControl('', [Validators.required, ValidationService.emailValidator]),
                subscriptionComment: new FormControl(''),
                subscriptionConditions: new FormControl('', Validators.required)
            });
        }
        // si c'est un cours de type privé, on prend automatiquement l'adresse privée pour l'adresse de facturation et de correspondance
        if (this.eventPublicType == 1) {
            this.eventSubscribeForm.controls.subscriptionAddressBillingType.setValue("Privée");
            this.eventSubscribeForm.controls.subscriptionAddressMailingType.setValue("Privée");
        }
        // sélectionne la suisse par défaut si aucun pays défini
        if (!this.user || this.user.country == '') {
            for (var i = 0; i < this.countries.length; i++) {
                if (this.countries[i].name.fr == 'Suisse') {
                    this.eventSubscribeForm.controls.subscriptionPrivateCountry.setValue(this.countries[i].id);
                }
            }
        }
        if (!this.user || this.user.company.country == '') {
            for (var i = 0; i < this.countries.length; i++) {
                if (this.countries[i].name.fr == 'Suisse') {
                    this.eventSubscribeForm.controls.subscriptionProCountry.setValue(this.countries[i].id);
                }
            }
        }
    };
    // met à jour l'affichage du formulaire d'inscription en fonction de différents paramètres
    EventDetails3.prototype.updateSubscriptionView = function () {
        // si les inscriptions sont fermées
        if (this.myEvent.event_subscription == 0) {
            this.stateSubscription = 0;
        }
        else if (this.codeAutorises != '' && this.user && this.user.hasOwnProperty('company_code') && !this.arrayContains(this.codeAutorises, this.user.company_code)) {
            this.stateSubscription = 1;
        }
        else if (this.myEvent.event_subscription == 1 && !this.user) {
            this.stateSubscription = 2;
        }
        else if (this.user && this.subscriptionState == 1) {
            this.stateSubscription = 3;
        }
        else if (this.user && this.subscriptionState == 2) {
            this.stateSubscription = 4;
        }
        else {
            this.stateSubscription = 5;
        }
    };
    // teste si un tableau contient une valeur donnée
    EventDetails3.prototype.arrayContains = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    };
    // affiche les modalités pratiques
    EventDetails3.prototype.openConditions = function () {
        var _this = this;
        var pageName = '';
        if (this.myEvent.category.id == 1) {
            pageName = 'modalites-pratiques-fc';
        }
        else if (this.myEvent.category.id == 15) {
            pageName = 'modalites-pratiques-1ers-secours';
        }
        else {
            return false;
        }
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
    EventDetails3.prototype.gotoLogin = function () {
        this.app.getRootNav().setRoot(this.loginPage);
    };
    EventDetails3.prototype.onSubmit = function (value) {
        var _this = this;
        if (this.eventSubscribeForm.valid) {
            value.eventPublicType = this.eventPublicType;
            var userId = '';
            if (this.user) {
                userId = this.user.id;
            }
            this.events.subscribe(this.myEvent.id, userId, value).then(function (data) {
                if (data.result == 1) {
                    var toast = _this.toastCtrl.create({
                        cssClass: 'toast-success',
                        message: data.msg,
                        showCloseButton: true,
                        closeButtonText: 'Ok'
                    });
                    toast.onDidDismiss(function () {
                        _this.e.publish('event:subscribed');
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
    EventDetails3 = __decorate([
        Component({
            templateUrl: 'event-details-3.html',
            selector: 'event-details-3'
        }),
        __metadata("design:paramtypes", [App, ToastController, ModalController, NavParams, MikiEventsService, MikiPubliciteService, Http, Events])
    ], EventDetails3);
    return EventDetails3;
}());
export { EventDetails3 };
//# sourceMappingURL=event-details-3.js.map