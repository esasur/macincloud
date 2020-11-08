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
var MikiEventsService = /** @class */ (function () {
    function MikiEventsService(http) {
        this.http = http;
    }
    /**
     * Récupère les events. Permet de définir l'id de la catégorie à récupérer. Si vide, récupert tous les events
     *
     * type : 1 = tous les events à venir; 2 = les events de l'année en cours (passés et à venir); 3 = les events de l'année prochaine
     *
     * public : true = récupère les événements de visibilité publique + privée
     *          false = récupère uniquement les événements de visibilité publique
     */
    MikiEventsService.prototype.getEvents = function (type, isPublic, idCategory) {
        if (isPublic) {
            isPublic = 1;
        }
        else {
            isPublic = 0;
        }
        if (idCategory != undefined && idCategory != '') {
            return this.http.get('http://es-asur.ch/api/index.php/events/list/' + type + '/' + isPublic + '/' + idCategory);
        }
        else {
            return this.http.get('http://es-asur.ch/api/index.php/events/list/' + type + '/' + isPublic);
        }
    };
    /**
     * Récupère les events auquel une personne donnée participe. Permet de définir l'id de la catégorie à récupérer. Si vide, récupert tous les events
     *
     * type : 1 = tous les events; 2 = les events passés; 3 = les events à venir
     */
    MikiEventsService.prototype.getEventsFromPerson = function (idPerson, type, idCategory) {
        if (idCategory != undefined && idCategory != '') {
            return this.http.get('http://es-asur.ch/api/index.php/events/person/list/' + idPerson + '/' + type + '/' + idCategory);
        }
        else {
            return this.http.get('http://es-asur.ch/api/index.php/events/person/list/' + idPerson + '/' + type + '/');
        }
    };
    MikiEventsService.prototype.getEvent = function (event_id) {
        return this.http.get('http://es-asur.ch/api/index.php/event/' + event_id);
        ;
    };
    MikiEventsService.prototype.isSubscribed = function (event_id, user_id) {
        return this.http.get('http://es-asur.ch/api/index.php/event/' + event_id + '/is_subscribed/' + user_id);
    };
    MikiEventsService.prototype.getCodesPros = function () {
        return this.http.get('http://es-asur.ch/api/index.php/events/infos/codes_pros');
    };
    MikiEventsService.prototype.getCountries = function () {
        return this.http.get('http://es-asur.ch/api/index.php/countries/list');
    };
    MikiEventsService.prototype.getCategoriesFromType = function (type) {
        return this.http.get('http://es-asur.ch/api/index.php/categories/' + type);
    };
    // inscrit une personne à un événement
    MikiEventsService.prototype.subscribe = function (eventId, personId, datas) {
        var _this = this;
        var params = "";
        params += 'eventId=' + eventId + '&personId=' + personId;
        params += '&params=' + JSON.stringify(datas);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // retourne une promise
        return new Promise(function (resolve, reject) {
            _this.http.post('http://es-asur.ch/api/index.php/events/subscribe/', params, { headers: headers }).subscribe(function (data) {
                resolve(data.json());
            }, function (err) {
                console.error(err);
                resolve(datas);
            } /*,
            () => console.log('Authentication Complete')*/);
        });
    };
    // retourne la date formatée correctement
    MikiEventsService.prototype.getDate = function (date) {
        var dateTemp = date.split(" ");
        dateTemp = dateTemp[0];
        dateTemp = dateTemp.split("-");
        return dateTemp[2] + "/" + dateTemp[1] + "/" + dateTemp[0];
    };
    MikiEventsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], MikiEventsService);
    return MikiEventsService;
}());
export { MikiEventsService };
//# sourceMappingURL=miki-events.js.map