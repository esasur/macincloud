import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {AccountEventsList1} from '../account-events-list-1/account-events-list-1';
import {AccountEventsList2} from '../account-events-list-2/account-events-list-2';


@Component({
  templateUrl: 'account-events-list.html',
  selector: 'account-events-list'
})
export class AccountEventsList {
  private user: boolean = false;
  public tabParams: any = {};
  // private year: any = '';
  // private nextYear: any = '';

  public tab1: any;
  public tab2: any;
  

  constructor(private navParams: NavParams) {
    
    // récupert l'utilisateur connecté (passé en paramètres)
    if (this.navParams.get("user")){
      this.user = this.navParams.get("user");
    }
    else{
      this.user = false;
    }

    // ajoute l'état de la connexion de l'utilisateur aux paramètres passés aux pages des tabs
    this.tabParams.user = this.user;

    // définit les tabs
    this.tab1 = AccountEventsList1;
    this.tab2 = AccountEventsList2;
  }
}
