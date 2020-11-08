import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler, App, NavController, Platform, MenuController, AlertController, Events } from 'ionic-angular';

import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';

import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device/ngx';
import { Push } from '@ionic-native/push/ngx';

import {Login} from '../pages/login/login';
import {AccountCreate} from '../pages/account-create/account-create';
import {EventsList} from '../pages/events-list/events-list';
import {AccountEdit} from '../pages/account-edit/account-edit';
import {AccountEventsList} from '../pages/account-events-list/account-events-list'
import {AccountEventsList1} from '../pages/account-events-list-1/account-events-list-1'
import {AccountEventsList2} from '../pages/account-events-list-2/account-events-list-2'
import {Documents} from '../pages/documents/documents';
import {DocumentsList} from '../pages/documents/documents-list';
import {Accueil} from '../pages/accueil/accueil';
import {PubliciteHome} from '../pages/publicite-home/publicite-home';
import {EventsList1} from '../pages/events-list-1/events-list-1';
import {EventsList2} from '../pages/events-list-2/events-list-2';
import {EventDetails} from '../pages/event-details/event-details';
import {EventDetails1} from '../pages/event-details-1/event-details-1';
import {EventDetails2} from '../pages/event-details-2/event-details-2';
import {EventDetails3} from '../pages/event-details-3/event-details-3';
import {PasswordRecovery} from '../pages/password-recovery/password-recovery';
import {Modalites} from '../pages/modalites/modalites';

import {MikiPersonService} from '../providers/miki-person';
import {MikiPubliciteService} from '../providers/miki-publicite';
import {MikiEventsService} from '../providers/miki-events';
import {MikiDocumentsService} from '../providers/miki-documents';
import {ValidationService} from '../providers/validation';





import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@NgModule({
  declarations: [
    MyApp,
    Login,
    AccountCreate,
    EventsList,
    AccountEdit,
    AccountEventsList,
    AccountEventsList1,
    AccountEventsList2,
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
    PasswordRecovery,
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
    AccountEventsList1,
    AccountEventsList2,
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
    PasswordRecovery,
    Modalites
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    Push,
    MikiPersonService,
    MikiPubliciteService,
    MikiEventsService,
    MikiDocumentsService,
    ValidationService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
