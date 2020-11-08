import {NavParams, LoadingController, Events, Tabs} from 'ionic-angular';
import {Component} from '@angular/core';
import {MikiEventsService} from '../../providers/miki-events';
import {EventDetails1} from '../event-details-1/event-details-1';
import {EventDetails2} from '../event-details-2/event-details-2';
import {EventDetails3} from '../event-details-3/event-details-3';
import {ViewChild} from '@angular/core';


@Component({
  templateUrl: 'event-details.html',
  selector: 'event-details',
})
export class EventDetails {
  public event;
  public myEvent: any;
  public eventTitle: any;
  public eventReady = false;
  public user = false;
  public tabParams: any = {};

  private loading: any;

  public tab1: any;
  public tab2: any;
  public tab3: any;


  @ViewChild('myTabs') tabRef: Tabs;



  constructor(private events: MikiEventsService, private loadingCtrl: LoadingController, private navParams: NavParams, private e: Events) {
    this.presentLoading();

    // lorsqu'une inscription a eu lieu, on affiche le premier onglet
    this.e.subscribe('event:subscribed', () => {
      // console.log('change tab done');
      this.tabRef.select(0);
      // alert('pass2');
    });

    // récupert l'event à afficher
    this.event = this.navParams.get('event');

    // récupert l'utilisateur connecté (passé en paramètres)
    if (this.navParams.get("user")){
      this.user = this.navParams.get("user");
    }
    else{
      this.user = false;
    }
    
    // ajoute l'état de la connexion de l'utilisateur aux paramètres passés aux pages des tabs
    this.tabParams.user = this.user;

    // récupert les données de l'event
    this.events.getEvent(this.event.id).subscribe(
      data => {
        this.myEvent = data.json().event;


        // ajoute l'event aux paramètres passés aux pages des tabs
        this.tabParams.myEvent = this.myEvent;

        // puis récupert les informations dont on a besoin
        this.eventTitle = this.myEvent.title.fr;

        // définit les tabs
        this.tab1 = EventDetails1;
        this.tab2 = EventDetails2;

        // si on a le droit de s'inscrire à l'event et que l'event est à venir (s'il n'a pas déjà eu lieu) on affiche le tab d'inscription
        if (this.event.futur && this.event.online_subscription == 1){
          this.event.showInscription = 1;
          this.tab3 = EventDetails3;
        }
        else{
          this.event.showInscription = 0;
        }

        // dit que l'event est chargé
        this.eventReady = true;
      },
      err => console.error(err),
      () => {
        this.loading.dismiss();
      }
    );
  }



  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Veuillez patienter..."
    });
    this.loading.present();
  }
}
