import {NavParams, NavController, LoadingController} from 'ionic-angular';
import {Component} from '@angular/core';
import {EventDetails} from '../event-details/event-details';
import {MikiEventsService} from '../../providers/miki-events';


@Component({
  templateUrl: 'account-events-list-2.html',
  selector: 'account-events-list-2'
})
export class AccountEventsList2 {
  public allEvents: any;
	public foundEvents: any = [];
  private loading: any;
  public search: string = '';
  private user: any = false;
  public pageTitle: string = 'Formations';
  public idCategory: any = '';
  


  constructor(public events: MikiEventsService, private loadingCtrl: LoadingController, private navParams: NavParams, private nav: NavController) {
    // this.presentLoading();

    // affiche tous les events
    this.idCategory = '';

    // définit le titre de la page
    this.pageTitle = 'Formations prévues';



    // récupert l'utilisateur connecté (passé en paramètres)
    if (this.navParams.get("user")){
      this.user = this.navParams.get("user");
    }
    else{
      this.user = false;
    }
  }



  ionViewDidEnter(){
    // this.presentLoading();
    this.refrechEvents();
  }




  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Veuillez patienter..."
    });
    this.loading.present();
  }



  // récupert la liste des events depuis le site
  refrechEvents(){
    if (this.user){
      this.events.getEventsFromPerson(this.user.id, 3).subscribe(
        data => {
          this.foundEvents = data.json().events;
          this.allEvents = this.foundEvents;
        },
        err => console.error(err),
        () => {
          // this.loading.dismiss();
        }
      );
    }
    else{
      // this.loading.dismiss();
      console.log('non connecté !');
    }  
  }



	// lors d'un clic sur un event
  eventClick(event, item) {
		this.nav.push(EventDetails, {
			event: item,
      user: this.user
		});
  }



  // filtre les events
  searchEvents(){
    let temp = [];
    let searchValue = this.search.toLowerCase();
    
    for(let event of this.allEvents){
      if (event.title.fr.toLowerCase().indexOf(searchValue) != -1 || event.description.fr.toLowerCase().indexOf(searchValue) != -1){
        temp.push(event);
      }
    }

    this.foundEvents = temp;
  }



  // action lors d'un refresh manuel (pull to refresh)
  doRefresh(refresher){
    if (this.user) {
      this.events.getEventsFromPerson(this.user.id, 3).subscribe(
        data => {
          this.foundEvents = data.json().events;
          this.allEvents = this.foundEvents;
        },
        err => {
          console.error(err);
        },
        () => {
          refresher.complete();
        }
      );
    }
    else{
    console.log('non connecté !');
    }
  }



  // réinitialise les events
  clearSearchEvents(){
    this.foundEvents = this.allEvents;
  }
}
