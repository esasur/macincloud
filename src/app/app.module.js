var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Push } from '@ionic-native/push';
import { Login } from '../pages/login/login';
import { AccountCreate } from '../pages/account-create/account-create';
import { EventsList } from '../pages/events-list/events-list';
import { AccountEdit } from '../pages/account-edit/account-edit';
import { AccountEventsList } from '../pages/account-events-list/account-events-list';
import { Documents } from '../pages/documents/documents';
import { DocumentsList } from '../pages/documents/documents-list';
import { Accueil } from '../pages/accueil/accueil';
import { PubliciteHome } from '../pages/publicite-home/publicite-home';
import { EventsList1 } from '../pages/events-list-1/events-list-1';
import { EventsList2 } from '../pages/events-list-2/events-list-2';
import { EventDetails } from '../pages/event-details/event-details';
import { EventDetails1 } from '../pages/event-details-1/event-details-1';
import { EventDetails2 } from '../pages/event-details-2/event-details-2';
import { EventDetails3 } from '../pages/event-details-3/event-details-3';
import { Modalites } from '../pages/modalites/modalites';
import { MikiPersonService } from '../providers/miki-person';
import { MikiPubliciteService } from '../providers/miki-publicite';
import { MikiEventsService } from '../providers/miki-events';
import { MikiDocumentsService } from '../providers/miki-documents';
import { ValidationService } from '../providers/validation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                Login,
                AccountCreate,
                EventsList,
                AccountEdit,
                AccountEventsList,
                Documents,
                DocumentsList,
                Accueil,
                PubliciteHome,
                EventsList1,
                EventsList2,
                EventDetails,
                EventDetails1,
                EventDetails2,
                EventDetails3,
                Modalites
            ],
            imports: [
                BrowserModule,
                IonicModule.forRoot(MyApp, {
                    tabbarPlacement: 'bottom',
                    prodMode: true
                }),
                HttpModule,
                IonicStorageModule.forRoot()
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                Login,
                AccountCreate,
                EventsList,
                AccountEdit,
                AccountEventsList,
                Documents,
                DocumentsList,
                Accueil,
                PubliciteHome,
                EventsList1,
                EventsList2,
                EventDetails,
                EventDetails1,
                EventDetails2,
                EventDetails3,
                Modalites
            ],
            providers: [
                StatusBar,
                SplashScreen,
                Storage,
                Device,
                Push,
                MikiPersonService,
                MikiPubliciteService,
                MikiEventsService,
                MikiDocumentsService,
                ValidationService,
                { provide: ErrorHandler, useClass: IonicErrorHandler }
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map