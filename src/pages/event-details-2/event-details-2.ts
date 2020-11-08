import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {MikiPubliciteService} from '../../providers/miki-publicite';


@Component({
  templateUrl: 'event-details-2.html',
  selector: 'event-details-2',
})
export class EventDetails2 {
  public myEvent: any;
  private user = false;

  public eventDescription: any = '';


  constructor(private navParams: NavParams, public mikiPublicite: MikiPubliciteService) {
    // récupert l'event passé en paramètre
  	this.myEvent = this.navParams.data.myEvent;
    
    // ainsi que l'état de la connexion de l'utilisateur
    this.user = this.navParams.data.user;

    // puis récupert les informations dont on a besoin
    this.eventDescription = this.myEvent.description.fr;
  }
}