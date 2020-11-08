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
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
var MikiPubliciteService = /** @class */ (function () {
    function MikiPubliciteService(platform, http, storage) {
        var _this = this;
        this.platform = platform;
        this.http = http;
        this.storage = storage;
        this.publicites = false;
        this.cursorFcTop = 0;
        this.cursorFcHome = 0;
        this.cursorPsTop = 0;
        this.cursorPsHome = 0;
        this.cursorStart = 0;
        this.timerTop = false;
        this.timerHome = false;
        platform.ready().then(function () {
            // récupert les publicités
            _this.init();
        });
    }
    MikiPubliciteService.prototype.init = function () {
        var _this = this;
        // si on a déjà récupéré l'info une fois on ne va pas la rechercher une seconde fois
        if (this.publicites) {
            return Promise.resolve(this.publicites);
        }
        // sinon on va la rechercher dans le stockage
        return new Promise(function (resolve, reject) {
            _this.platform.ready().then(function () {
                _this.storage.get('publicites').then(function (publicites) {
                    // si on a trouvé les publicités
                    if (publicites != undefined) {
                        _this.publicites = JSON.parse(publicites);
                        resolve(_this.publicites);
                    }
                    else {
                        // console.log('get pub');
                        _this.getPublicites(2, true, true).then(function (data) {
                            _this.getPublicites(3, true, true).then(function (data) {
                                _this.getPublicites(4, true, true).then(function (data) {
                                    _this.getPublicites(5, true, true).then(function (data) {
                                        _this.getPublicites(6, true, true).then(function (data) {
                                            resolve(_this.publicites);
                                            // console.log(this.publicites);
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    };
    // raffraichit la liste des publicités
    MikiPubliciteService.prototype.refresh = function () {
        var _this = this;
        // sinon on va la rechercher dans le stockage
        return new Promise(function (resolve, reject) {
            _this.getPublicites(2, true, true).then(function (data) {
                _this.getPublicites(3, true, true).then(function (data) {
                    _this.getPublicites(4, true, true).then(function (data) {
                        _this.getPublicites(5, true, true).then(function (data) {
                            _this.getPublicites(6, true, true).then(function (data) {
                                resolve(_this.publicites);
                            });
                        });
                    });
                });
            });
        });
    };
    /**
     * Récupère les publicité. Permet de définir l'id de la catégorie à récupérer. Si vide, récupert tous les events
     *
     * type : 1 = toutes les publicités; 2 = uniquement les publicités pour 'Formation Continue - Accueil'; 3 = uniquement les publicités pour 'Formation Continue - Haut';
     *        4 = uniquement les publicités pour '1ers Secours - Accueil'; 5 = uniquement les publicités pour '1ers Secours - Haut';
              6 = uniquement les publicités pour le démarrage de l'application
     * work : si TRUE, on renvoie uniquement les publicités actives et pondérées
     * refresh : si on veut rafraichir les données si elles existent déjà. FALSE par défaut.
     */
    MikiPubliciteService.prototype.getPublicites = function (type, work, refresh) {
        var _this = this;
        if (work === void 0) { work = false; }
        if (refresh === void 0) { refresh = false; }
        var pubs;
        var request = '';
        if (type == 1) {
            request = 'http://es-asur.ch/api/index.php/publicite/';
        }
        else if (type == 2) {
            request = 'http://es-asur.ch/api/index.php/publicite/48/';
        }
        else if (type == 3) {
            request = 'http://es-asur.ch/api/index.php/publicite/49/';
        }
        else if (type == 4) {
            request = 'http://es-asur.ch/api/index.php/publicite/58/';
        }
        else if (type == 5) {
            request = 'http://es-asur.ch/api/index.php/publicite/59/';
        }
        else if (type == 6) {
            request = 'http://es-asur.ch/api/index.php/publicite/62/';
        }
        // retourne une promise
        return new Promise(function (resolve, reject) {
            // si on a déjà récupéré les pubs et qu'on ne doit pas les rafraichir
            if (!refresh && _this.publicites) {
                return resolve(_this.publicites);
            }
            // sinon on récupert les publicités
            pubs = _this.http.get(request).subscribe(function (data) {
                pubs = data.json();
                if (pubs.result == 0) {
                    resolve(false);
                }
                pubs = pubs.publicites;
                // si on doit traiter les publicités
                if (work == true) {
                    var temp = [];
                    // parcourt toutes les publicités
                    for (var _i = 0, pubs_1 = pubs; _i < pubs_1.length; _i++) {
                        var pub = pubs_1[_i];
                        if (pub.hasOwnProperty('state') && pub.hasOwnProperty('weight') && pub.state == 1) {
                            // ajoute X fois la publicité au résultat, X étant égal au poid de la publicité
                            for (var x = 0; x < pub.weight; x++) {
                                temp.push(pub);
                            }
                        }
                    }
                    // mélange le tableau
                    temp = _this.shuffle(temp);
                    if (!_this.publicites) {
                        _this.publicites = {};
                    }
                    // enregistre les publicités
                    if (type == 2) {
                        _this.publicites['fc_home'] = temp;
                    }
                    else if (type == 3) {
                        _this.publicites['fc_top'] = temp;
                    }
                    else if (type == 4) {
                        _this.publicites['ps_home'] = temp;
                    }
                    else if (type == 5) {
                        _this.publicites['ps_top'] = temp;
                    }
                    else if (type == 6) {
                        _this.publicites['start'] = temp;
                    }
                    if (_this.storage) {
                        _this.storage.set('publicites', JSON.stringify(_this.publicites));
                    }
                    resolve(temp);
                }
                else {
                    resolve(pubs);
                }
            }, function (err) {
                console.error(err);
                resolve(false);
            });
        });
    };
    /**
     * Comptabilise une vue d'une publicité dans les statistiques
     *
     * pubId : id de la publicité
     * type : 1 = view; 2 = clic;
     */
    MikiPubliciteService.prototype.addStat = function (pubId, type) {
        var _this = this;
        var params = "";
        // params += 'pubId=' + pubId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // détermine le type de statistique
        if (type == 1) {
            type = "view";
        }
        else if (type == 2) {
            type = "clic";
        }
        else {
            return (false);
        }
        // retourne une promise
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/events/publicite/' + type + '/' + pubId + '/', params, { headers: headers }).subscribe(function (data) {
                resolve(data.json());
            }, function (err) {
                console.error(err);
                resolve(false);
            } /*,
            () => console.log('Authentication Complete')*/);
        });
    };
    // définit le chemin de l'image d'une publicité
    MikiPubliciteService.prototype.getPath = function (el) {
        var max_width = window.innerWidth;
        var thumb = '';
        if (max_width <= 100)
            thumb = '100/';
        else if (max_width <= 200)
            thumb = '200/';
        else if (max_width <= 500)
            thumb = '500/';
        else if (max_width <= 1000)
            thumb = '1000/';
        else if (max_width <= 1500)
            thumb = '1500/';
        else
            thumb = '';
        return 'http://es-asur.ch/' + el.pictures[0].folder + thumb + el.pictures[0].filename;
    };
    // affiche la prochaine image de type "type"
    MikiPubliciteService.prototype.current = function (type) {
        var _this = this;
        var pub = null;
        // si les publicités n'ont pas encore été chargées, on les charge
        if ((type == 'fc_home' && this.publicites.fc_home == undefined) ||
            (type == 'fc_top' && this.publicites.fc_top == undefined) ||
            (type == 'ps_home' && this.publicites.ps_home == undefined) ||
            (type == 'ps_top' && this.publicites.ps_top == undefined) ||
            (type == 'start' && this.publicites.ps_top == undefined)) {
            this.refresh().then(function (data) {
                _this.current(type);
            });
        }
        else {
            if (type == 'fc_home') {
                pub = this.publicites.fc_home[this.cursorFcHome];
                return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
            }
            else if (type == 'fc_top') {
                pub = this.publicites.fc_top[this.cursorFcTop];
                return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
            }
            else if (type == 'ps_home') {
                pub = this.publicites.ps_home[this.cursorPsHome];
                return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
            }
            else if (type == 'ps_top') {
                pub = this.publicites.ps_top[this.cursorPsTop];
                return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
            }
            else if (type == 'start') {
                pub = this.publicites.start[this.cursorStart];
                return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
            }
        }
    };
    // passe à la prochaine image de type "type"
    MikiPubliciteService.prototype.next = function (type) {
        if (type == 'fc_home') {
            this.cursorFcHome = (this.cursorFcHome + 1) % this.publicites.fc_home.length;
        }
        else if (type == 'fc_top') {
            this.cursorFcTop = (this.cursorFcTop + 1) % this.publicites.fc_top.length;
        }
        else if (type == 'ps_home') {
            this.cursorPsHome = (this.cursorPsHome + 1) % this.publicites.ps_home.length;
        }
        else if (type == 'ps_top') {
            this.cursorPsTop = (this.cursorPsTop + 1) % this.publicites.ps_top.length;
        }
        else if (type == 'start') {
            this.cursorStart = (this.cursorStart + 1) % this.publicites.start.length;
        }
    };
    // démarre le timer de type "type"
    MikiPubliciteService.prototype.start = function (type) {
        var publicite = this;
        if (type == 'fc_home') {
            this.timerHome = setInterval(function () { publicite.next(type); }, 3000);
        }
        else if (type == 'fc_top') {
            this.timerTop = setInterval(function () { publicite.next(type); }, 3000);
        }
        else if (type == 'ps_home') {
            this.timerHome = setInterval(function () { publicite.next(type); }, 3000);
        }
        else if (type == 'ps_top') {
            this.timerTop = setInterval(function () { publicite.next(type); }, 3000);
        }
        else if (type == 'start') {
            this.timerHome = setInterval(function () { publicite.next(type); }, 3000);
        }
    };
    // arrête le time de type "type"
    MikiPubliciteService.prototype.stop = function (type) {
        if (type == 'fc_home' || type == 'ps_home' || type == 'start') {
            clearInterval(this.timerHome);
        }
        else if (type == 'fc_top' || type == 'ps_top') {
            clearInterval(this.timerTop);
        }
    };
    /**
     * Shuffles array in place.
     * @param {Array} a items The array containing the items.
     */
    MikiPubliciteService.prototype.shuffle = function (a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    };
    MikiPubliciteService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform, Http, Storage])
    ], MikiPubliciteService);
    return MikiPubliciteService;
}());
export { MikiPubliciteService };
//# sourceMappingURL=miki-publicite.js.map