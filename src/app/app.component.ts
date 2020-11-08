import { Component, ViewChild } from '@angular/core';
// import { Platform, NavController } from 'ionic-angular';
import {App, NavController, Platform, MenuController, AlertController, Events} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push/ngx';

// import { TabsPage } from '../pages/tabs/tabs';
import {Login} from '../pages/login/login';
import {AccountCreate} from '../pages/account-create/account-create';
import {EventsList} from '../pages/events-list/events-list';
import {AccountEdit} from '../pages/account-edit/account-edit';
import {AccountEventsList} from '../pages/account-events-list/account-events-list'
import {Documents} from '../pages/documents/documents';
import {DocumentsList} from '../pages/documents/documents-list';
import {Accueil} from '../pages/accueil/accueil';
import {PubliciteHome} from '../pages/publicite-home/publicite-home';
import {MikiPersonService} from '../providers/miki-person';
import {MikiPubliciteService} from '../providers/miki-publicite';
import {EventsList1} from '../pages/events-list-1/events-list-1';
import {EventsList2} from '../pages/events-list-2/events-list-2';

// @Component({
//   templateUrl: 'app.html'
// })
// export class MyApp {
//   rootPage:any = TabsPage;

//   constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
//     platform.ready().then(() => {
//       // Okay, so the platform is ready and our plugins are available.
//       // Here you can do any higher level native things you might need.
//       statusBar.styleDefault();
//       splashScreen.hide();
//     });
//   }
// }




@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild('content') nav : NavController;

  rootPage: any = PubliciteHome;

  accueilPage: any = Accueil;
  loginPage: any = Login;
  CreateAccountPage: any = AccountCreate;
  accountEdit: any = AccountEdit;
  accountEventsList: any = AccountEventsList;
  EventsList: any = EventsList;
  Documents: any = Documents;
  DocumentsList: any = DocumentsList;
  pushToken: string = '';
  // user: any = false;  // peut être FALSE ou un objet représentant la personne connectée

  eventsList_1: any = EventsList1;
  eventsList_2: any = EventsList2;


  constructor(private app: App, private platform: Platform, private menu: MenuController, private events: Events, private mikiPerson: MikiPersonService, private mikiPublicite: MikiPubliciteService, public alertCtrl: AlertController, private statusBar: StatusBar, private push: Push) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      // initialise le stockage local
      // this.local = new Storage(LocalStorage);

      // récupert les publicités et lance le slide
      this.mikiPublicite.refresh().then(data => {
        // vérifie si une publicité existe bien pour le départ
        if (mikiPublicite.publicites['start'].length > 0){
          mikiPublicite.start('top');
          // this.events.publish('publicites:loaded');

          // let nav = this.app.getComponent('nav');

          this.app.getRootNav().setRoot(PubliciteHome, { pubType: 'start', user: this.mikiPerson.user });
        }
        else{
          this.app.getRootNav().setRoot(Accueil);
        }
      });



      // this.checkConnection();
      this.mikiPerson.checkConnection().then(data => {
        // si un utilisateur est authentifié et que le token est déjà enregistré, on met à jour le token de l'utilisateur
        if (data !== false && this.mikiPerson.user){
          this.mikiPerson.setPushToken(this.pushToken);
        }
      });

      // lorsqu'une publicité est fermée
      this.events.subscribe('homePublicite:closed', (pubType) => {
        if (pubType == 'start'){
          this.app.getRootNav().setRoot(Accueil);
        }
        else if (pubType == 'fc_home'){
          this.app.getRootNav().setRoot(EventsList, { idCategory: 1, user: this.mikiPerson.user });
        }
        else if (pubType == 'ps_home'){
          this.app.getRootNav().setRoot(EventsList, { idCategory: 15, user: this.mikiPerson.user });
        }
      });

      // lorsqu'une personne est authentifiée
      this.events.subscribe('user:login', () => {
        // rafraichit l'utilisateur puis ouvre une page
        this.mikiPerson.refreshUser().then(data => {
          this.openPage(Accueil);
        });

        // et ajoute le token pour les notifications à l'utilisateur
        this.mikiPerson.setPushToken(this.pushToken);
      });

      // lorsqu'une personne est déconnectée
      this.events.subscribe('user:logout', () => {
        // console.log('logout');
        // this.mikiPerson = false;
        
        // rafraichit l'utilisateur puis ouvre une page
        this.mikiPerson.refreshUser().then(data => {
          this.openPage(Accueil);
        });
      });

      // lorsqu'un compte utilisateur est créé
      this.events.subscribe('account:created', () => {
        // rafraichit l'utilisateur
        this.mikiPerson.refreshUser();
      });

      // lorsqu'un compte utilisateur est créé et qu'on a clické sur "OK"
      this.events.subscribe('account:createdOk', () => {
        // ouvre une page
        this.openPage(AccountEdit);
      });

      // lorsqu'un compte utilisateur est modifié
      this.events.subscribe('account:updated', () => {
        // rafraichit l'utilisateur puis ouvre une page
        this.mikiPerson.refreshUser();
      });


      // enregistre l'application pour la réception de notifications Push
      let myPush = this.push.init({
          android: {
              // senderID: "1085264931012"
          },
          ios: {
              alert: "true",
              badge: true,
              sound: 'true'
          },
          windows: {}
      });

      if (myPush != undefined){
        myPush.on('registration').subscribe((data: any) => {
            // sauvegarde le token
            this.pushToken = data.registrationId;

            // si un utilisateur est authentifié, on met à jour son token
            if (this.mikiPerson.user){
              this.mikiPerson.setPushToken(this.pushToken);
            }
        });

        myPush.on('notification').subscribe((data: any) => {
          alert(data.message);
            console.log(data.message);
            console.log(data.title);
            console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);
        });

        myPush.on('error').subscribe((error: any) => {
            console.log(error.message);
        });
      }
    });
    // fin de l'enregistrement pour la réception de notifications Push
  }



  openPage(page): void {
    // if (page == Accueil && nav.length() > 1){
    //   console.log('pop');
    //   nav.pop();
    // }
    // else{
      // console.log('setRoot');
      console.log(page);
      this.app.getRootNav().setRoot(page, { user: this.mikiPerson.user });
    // }

    this.menu.close();
  }



  // affiche la page des events. Permet de définir l'id de la catégorie à afficher. Si vide, affiche tous les events
  openEvents(idCategory?: number){
    if (idCategory != undefined){
      this.events.publish('eventCategory:changed', idCategory);
    }

    // on ouvre uniquement la page des events si elle n'est pas déjà affichée
    if (this.rootPage != this.EventsList){  


      

      // si la catégorie est fournie, on la passe à la page
      if (idCategory != undefined){

        if (idCategory == 30){
          // si des publicités sont configurées on les affiche
          if (this.mikiPublicite.publicites != undefined && this.mikiPublicite.publicites.fc_home.length > 0){
            this.nav.push(PubliciteHome, { pubType: 'fc_home', user: this.mikiPerson.user });
          }
          else{
            this.nav.push(EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
          }
        }
        else if(idCategory == 31){
          // si des publicités sont configurées on les affiche
          if (this.mikiPublicite.publicites != undefined && this.mikiPublicite.publicites.ps_home.length > 0){
            this.nav.push(PubliciteHome, { pubType: 'ps_home', user: this.mikiPerson.user });
          }
          else{
            this.nav.push(EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
          }
        }
        else{
          this.nav.push(this.EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
        }

        // this.app.getRootNav().setRoot(EventsList, { idCategory: idCategory, user: this.mikiPerson.user });
      }
      else{
        this.app.getRootNav().setRoot(EventsList, { user: this.mikiPerson.user });
      }
    }
    // sinon on raffraichit simplement les cours
    else{
      if (idCategory != undefined){
        this.events.publish('eventCategory:changed', idCategory);
      }
    }
    
    this.menu.close();
  }



  // décnnection
  disconnect(){
    let confirm = this.alertCtrl.create({
      title: 'Déconnection',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.mikiPerson.disconnect();
          }
        },
        {
          text: 'Non',
          handler: () => {}
        }
      ]
    });

    this.menu.close();
    confirm.present();
  }
}