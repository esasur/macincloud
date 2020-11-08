var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
var MikiPersonService = /** @class */ (function () {
    function MikiPersonService(platform, http, events, device, storage) {
        var _this = this;
        this.platform = platform;
        this.http = http;
        this.events = events;
        this.device = device;
        this.storage = storage;
        this.user = false; // peut être FALSE ou un objet représentant la personne connectée
        platform.ready().then(function () {
            // initialise le stockage
            // this.storage = new Storage(SqlStorage);
            // this.storage = new Storage(LocalStorage);
        });
        // vérifie si l'utilisateur est connecté
        this.checkConnection().then(function (data) {
            _this.user = data;
        });
    }
    MikiPersonService.prototype.login = function (person) {
        if (typeof person === 'object') {
            person = JSON.stringify(person);
        }
        this.storage.set('mikiPerson', person);
        this.user = JSON.parse(person);
        ;
        this.events.publish('user:login');
    };
    // déconnecte l'utilisateur
    MikiPersonService.prototype.disconnect = function () {
        this.user = false;
        this.events.publish('user:logout');
        this.storage.remove('mikiPerson');
    };
    // vérifie si l'utilisateur est connecté (promise)
    // si force = TRUE, on raffraichit l'utilisateur soit depuis le stockage, soit depuis la base de données.
    MikiPersonService.prototype.checkConnection = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        // si on a déjà récupéré l'info une fois on ne va pas la rechercher une seconde fois
        if (!force && this.user) {
            return Promise.resolve(this.user);
        }
        // sinon on va la rechercher dans le stockage
        return new Promise(function (resolve, reject) {
            _this.platform.ready().then(function () {
                _this.storage.get('mikiPerson').then(function (mikiPerson) {
                    if (mikiPerson == undefined) {
                        _this.user = false;
                    }
                    else {
                        var person = JSON.parse(mikiPerson);
                        // vérifie si c'est bien un objet qui possède au moins un id
                        if (person.hasOwnProperty('id') && !Number.isNaN(person.id)) {
                            _this.user = person;
                        }
                        else {
                            _this.user = false;
                        }
                    }
                    // retourne l'utilisateur
                    resolve(_this.user);
                });
            });
        });
    };
    // raffraichit les données de l'utilisateur
    MikiPersonService.prototype.refreshUser = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.checkConnection(true).then(function (data) {
                // this.user = data;
                if (_this.user) {
                    _this.http.get('http://es-asur.ch/api/index.php/persons/' + _this.user.id).subscribe(function (data) {
                        var datas = data.json();
                        if (datas.result == 1) {
                            _this.user = datas.person;
                            _this.storage.set('mikiPerson', JSON.stringify(_this.user));
                        }
                        else {
                            _this.user = false;
                        }
                    }, function (err) {
                        console.error(err);
                        resolve(false);
                    });
                }
                // retourne l'utilisateur
                resolve(_this.user);
            });
        });
    };
    // fait une tentative de connexion avec un nom d'utilisateur et un mot de passe donné
    MikiPersonService.prototype.testConnection = function (username, password) {
        var _this = this;
        // let params = "username=" + username + "&password=" + password;
        var params = "username=" + username + "&password=" + password + "&mobileApp=1";
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/persons/connect/', params, { headers: headers }).subscribe(function (data) {
                var datas = data.json();
                if (datas.result == 1) {
                    _this.login(datas.person);
                    resolve(datas.person);
                }
                else {
                    resolve(false);
                }
            }, function (err) {
                console.error(err);
                resolve(false);
            } /*,
            () => console.log('Authentication Complete')*/);
        });
    };
    // modifie les données personnelles d'une personne
    MikiPersonService.prototype.editAccount = function (personId, datas) {
        var _this = this;
        var params = "";
        params += 'params=' + JSON.stringify(datas);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // retourne une promise
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/persons/' + personId + '/edit', params, { headers: headers }).subscribe(function (data) {
                resolve(data.json());
            }, function (err) {
                console.error(err);
                resolve(datas);
            } /*,
            () => console.log('Authentication Complete')*/);
        });
    };
    // modifie les données personnelles d'une personne
    MikiPersonService.prototype.deleteAccount = function (personId) {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // retourne une promise
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/persons/' + personId + '/account_delete', null, { headers: headers }).subscribe(function (data) {
                resolve(data.json());
            }, function (err) {
                console.error(err);
                resolve(false);
            } /*,
            () => console.log('Authentication Complete')*/);
        });
    };
    // créé un nouveau compte utilisateur
    MikiPersonService.prototype.createAccount = function (datas) {
        var _this = this;
        var params = 'params=' + JSON.stringify(datas);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // retourne une promise
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/account/create/2', params, { headers: headers }).subscribe(function (dataCreate) {
                // vérifie que la création du compte ait fonctionnée
                if (dataCreate.json().result == 0) {
                    resolve(dataCreate.json());
                }
                var paramsConnect = "username=" + datas.email + "&password=" + datas.passwords.password;
                // une fois le compte créé, on logue l'utilisateur
                _this.http.post('http://es-asur.ch/api/index.php/persons/connect/', paramsConnect, { headers: headers }).subscribe(function (dataConnect) {
                    var datasConnect = dataConnect.json();
                    if (datasConnect.result == 1) {
                        _this.storage.set('mikiPerson', JSON.stringify(datasConnect.person));
                        _this.user = datasConnect.person;
                        resolve(dataCreate.json());
                    }
                }, function (err) {
                    console.error(err);
                    return false;
                });
            }, function (err) {
                console.error(err);
                resolve(datas);
            });
        });
    };
    MikiPersonService.prototype.setPushToken = function (pushToken) {
        var _this = this;
        var datas = {
            pushToken: pushToken,
            pushDevice: this.device.platform
        };
        var params = 'params=' + JSON.stringify(datas);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // retourne une promise
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/persons/' + _this.user.id + '/edit', params, { headers: headers }).subscribe(function (data) {
                resolve(data.json());
            }, function (err) {
                console.error(err);
            } /*,
            () => console.log('Authentication Complete')*/);
        });
    };
    MikiPersonService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform, Http, Events, Device, Storage])
    ], MikiPersonService);
    return MikiPersonService;
}());
export { MikiPersonService };
//# sourceMappingURL=miki-person.js.map