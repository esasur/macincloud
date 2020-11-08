import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {MikiEventsService} from '../../providers/miki-events';
import {MikiPubliciteService} from '../../providers/miki-publicite';


@Component({
  templateUrl: 'event-details-1.html',
  selector: 'event-details-1'
})
export class EventDetails1 {
  public myEvent: any;
  private user = false;

  public eventTitle: any;
  public eventDescription: any = '';
  public eventDateStart: any;
  public eventDateStop: any;
  public eventCategory: any;
  public eventCategories: any;
  public eventTheme: any;
  public eventAddress: any = '';
  public eventPic = '';
  public msgParticipants: any = ''
  public entrance: string = '';
  public eventPrices: any = [];


  constructor(private events: MikiEventsService, public mikiPublicite: MikiPubliciteService, private navParams: NavParams) {
    // récupert l'event passé en paramètre
  	this.myEvent = this.navParams.data.myEvent;

    // ainsi que l'état de la connexion de l'utilisateur
    this.user = this.navParams.data.user;

    // puis récupert les informations dont on a besoin
    this.eventTitle = this.myEvent.title.fr;
    this.eventDescription = this.myEvent.description.fr;

    // let dateStartTemp = this.myEvent.date_start.split(" ");
    
    if (this.myEvent.date_start != '0000-00-00 00:00:00'){
      this.eventDateStart = this.events.getDate(this.myEvent.date_start);
    }
    else{
      this.eventDateStart = 'Date précisée ultérieurement';
    }

    if (this.myEvent.date_start != '0000-00-00 00:00:00'){
      this.eventDateStop = this.events.getDate(this.myEvent.date_stop);
    }
    else{
      this.eventDateStop = 'Date précisée ultérieurement';
    }
    // this.eventDateStop = this.events.getDate(this.myEvent.date_stop);

    this.eventCategory = this.myEvent.category.name.fr;
    this.eventTheme = this.myEvent.theme.name.fr;

    this.eventCategories = '';
    for (let cat of this.myEvent.categories){
      this.eventCategories += cat.name.fr + '<br>';
    }
        
    // this.eventReady = true;  // pour savoir si on peut afficher les dates

    if (this.myEvent.place != "")
      this.eventAddress += "<div>" + this.myEvent.place + "</div>";
    
    if (this.myEvent.city != ""){
      if (this.myEvent.address != "")
        this.eventAddress += "<div itemprop='streetAddress'>" + this.myEvent.address + "</div>";
      
      if (this.myEvent.city != "")
        this.eventAddress += "<div itemprop='addressLocality'>" + this.myEvent.city + "</div>";
      
      if (this.myEvent.region != "" && this.myEvent.country != "")
        this.eventAddress += "<div><span itemprop='addressRegion'>" + this.myEvent.region + "</span>, <span itemprop='addressCountry'>" + this.myEvent.country + "</span></div>";
      else if (this.myEvent.country != "")
        this.eventAddress += "<div itemprop='addressCountry'>" + this.myEvent.country + "</div>";
    }

    // détermine l'image (si image par défaut on n'en affiche pas)
    if (this.myEvent.pics.length > 0){
    		this.eventPic = this.myEvent.pics[0];
    }

    // le nombre max de participants ou de places restantes
    if (this.myEvent.max_participants == 0){
      this.msgParticipants = "illimité";
    }
    else{
      this.msgParticipants = (this.myEvent.max_participants - this.myEvent.nb_participants) + " places restantes";
    }


    // récupert les prix d'entrée
    if (this.myEvent.entrance_type == 0){
      this.entrance =  'Libre';
    }
    else{
      for(let myPrice of this.myEvent.prices){
        this.entrance += "<div class='event_price'><div class='event_price__title'>" + myPrice.title.fr + "</div>";
        
        if (myPrice.description.fr != '')
          this.entrance += "<div class='event_price__description'>" + myPrice.description.fr + "</div>";

        this.entrance += "<div class='event_price__price'>" + myPrice.price + "</div></div>";
      }
    }
  }
}