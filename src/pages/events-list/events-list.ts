import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
// import {EventDetails} from '../event-details/event-details';
import {EventsList1} from '../events-list-1/events-list-1';
import {EventsList2} from '../events-list-2/events-list-2';



@Component({
  templateUrl: 'events-list.html',
  selector: 'events-list'
})
export class EventsList {
  private user: boolean = false;
  public tabParams: any = {};
  public year: any = '';
  public nextYear: any = '';
  // private pubViewed: boolean = false;

  public tab1: any;
  public tab2: any;
  

  constructor(private navParams: NavParams) {
    // récupert l'utilisateur connecté (passé en paramètres)
    if (this.navParams.get("user")){
      this.user = this.navParams.get("user");
    }
    // sinon on affiche toutes les catégories
    else{
      this.user = false;
    }
    
    // ajoute l'état de la connexion de l'utilisateur aux paramètres passés aux pages des tabs
    this.tabParams.user = this.user;

    // passe l'id de la catégorie à afficher si donnée
    if (this.navParams.get("idCategory")){
      this.tabParams.idCategory = this.navParams.get("idCategory");
    }
    // sinon on affiche toutes les catégories
    else{
      this.tabParams.idCategory = '';
    }

    this.year = new Date().getFullYear();
    this.nextYear = this.year + 1;

    // définit les tabs
    this.tab1 = EventsList1;
    this.tab2 = EventsList2;
  }
}
