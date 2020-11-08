import {App, NavParams, LoadingController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {EventDetails} from '../event-details/event-details';
import {MikiEventsService} from '../../providers/miki-events';
import {MikiPubliciteService} from '../../providers/miki-publicite';


@Component({
  templateUrl: 'events-list-2.html',
  selector: 'events-list-2'
})
export class EventsList2 {
  public allEvents: any;
	public foundEvents: any = [];
  private loading: any;
  public search: string = '';
  private user: boolean = false;
  public pageTitle: string = 'Formations';
  public idCategory: any = '';
  public themes: any = [];
  public id_theme: any = '';
  public subvention_vd: any = '';
  


  constructor(private app: App, public events: MikiEventsService, public mikiPublicite: MikiPubliciteService, private e: Events, private loadingCtrl: LoadingController, private navParams: NavParams) {
    // this.presentLoading();

    // récupert l'id de la catégorie à afficher si donné
    if (this.navParams.data.idCategory){
      this.idCategory = this.navParams.data.idCategory;
    }
    // sinon affiche tous les events
    else{
      this.idCategory = '';
    }

    // récupert l'état de la connexion de l'utilisateur
    this.user = this.navParams.data.user;

    // this.refrechEvents();

    // définit le titre de la page
    this.refreshTitle();

    // s'inscrit au changement de catégorie des events
    this.e.subscribe('eventCategory:changed', (idCategory) => {
      this.idCategory = idCategory;

      // définit le titre de la page
      this.refreshTitle();
      
      // rafraichit les cours
      this.refrechEvents();
    });



    // récupert la liste des thèmes
    this.events.getCategoriesFromType('miki_event_theme').subscribe(
      data => {
        this.themes = data.json().categories;

        // ne prend pas le thème "Aucun"
        let temp = [];
        for (let theme of this.themes){
          if (theme.name.fr != undefined && theme.name.fr != "Aucun"){
            temp.push(theme);
          }
        }
        this.themes = temp;

        // sélectionne le premier thème
        if (this.themes.length > 0){
          // this.id_theme = this.themes[0].id;
          this.id_theme = "";
        }
      },
      err => console.error(err)
    );
  }



  ionViewDidEnter(){
    // this.presentLoading();
    this.refrechEvents();
  }



  // re-définit le titre de la page en fonction de la catégorie de cours affichés
  refreshTitle(){
    if (this.idCategory == 1){
      this.pageTitle = 'Formations Continue ' + (new Date().getFullYear() + 1);
    }
    else if (this.idCategory == 15){
      this.pageTitle = '1ers Secours ' + (new Date().getFullYear() + 1);
    }
    else{
      this.pageTitle = 'Formations ' + (new Date().getFullYear() + 1); 
    }
  }



  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Veuillez patienter..."
    });
    this.loading.present();
  }



  // récupert la liste des events depuis le site
  refrechEvents(){
    this.events.getEvents(3, this.user == false, this.idCategory).subscribe(
      data => {
        this.foundEvents = data.json().events;

        let eventsFutur = Array();
        let eventsPassed = Array();

        // place les cours futurs avant les cours passés
        for(let event of this.foundEvents){

          if (event.futur){
            eventsFutur.push(event);
          }
          else{
            eventsPassed.push(event);
          }

          this.foundEvents = eventsFutur.concat(eventsPassed);
        }

        this.allEvents = this.foundEvents;
        this.searchEvents();
      },
      err => console.error(err),
      () => {
        // this.loading.dismiss();
      }
    );
  }



	// lors d'un clic sur un event
  eventClick(event, item) {
    this.app.getRootNav().push(EventDetails, {
    // this.nav.parent.push(EventDetails, {
      event: item,
      user: this.user
    });
  }



  // filtre les events
  searchEvents(){
    let temp = [];
    let searchValue = this.search.toLowerCase();
    
    for(let event of this.allEvents){
      let keep = true;
      
      // si le thème ne correspond pas, on ne prend pas en compte l'event
      if (this.id_theme != '' && event.id_theme != this.id_theme){
        keep = false;
      }

      // si la subvention ne correspond pas, on ne prend pas en compte l'event
      if (this.subvention_vd != '' && event.subvention_vaud != this.subvention_vd){
        keep = false;
      }
      // si les termes de recherche ne correspondent pas, on ne prend pas en compte l'event
      if (event.title.fr.toLowerCase().indexOf(searchValue) == -1 && event.description.fr.toLowerCase().indexOf(searchValue) == -1){
        keep = false;
      }

      // si on doit prendre en compte l'event
      if (keep){
        temp.push(event);
      }
    }

    this.foundEvents = temp;
  }



  // action lors d'un refresh manuel (pull to refresh)
  doRefresh(refresher){
    this.events.getEvents(3, this.user == false, this.idCategory).subscribe(
      data => {
        this.foundEvents = data.json().events;

        let eventsFutur = Array();
        let eventsPassed = Array();

        // place les cours futurs avant les cours passés
        for(let event of this.foundEvents){

          if (event.futur){
            eventsFutur.push(event);
          }
          else{
            eventsPassed.push(event);
          }

          this.foundEvents = eventsFutur.concat(eventsPassed);
        }

        this.allEvents = this.foundEvents;
        this.searchEvents();
      },
      err => {
        console.error(err);
      },
      () => {
        refresher.complete();
      }
    );
  }



  // réinitialise les events
  clearSearchEvents(){
    this.foundEvents = this.allEvents;
  }
}
