import {Events, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {MikiPubliciteService} from '../../providers/miki-publicite';


@Component({
  templateUrl: 'publicite-home.html',
  selector: 'publicite-home'
})
export class PubliciteHome{

  public pubType: string = '';
  public printButton: boolean = false;
  // private canPrintButton: boolean = false;

  constructor(public mikiPublicite: MikiPubliciteService, private events: Events, private navParams: NavParams) {
      
  	// récupert le type de publicité à afficher (fc_home/ps_home pour "formation continue/premiers secours")
    if (this.navParams.data.pubType){
      this.pubType = this.navParams.data.pubType;

      // si c'est la publicité de démarrage, affiche le bouton pour quitter la pub seulement après 3 secondes
      if (this.pubType == 'start'){
        this.printButton = false;
        
        var el = this;

        setTimeout(function(){ 
          el.printButton = true;
        }, 4000);
      }
      else{
        this.printButton = true;
      }
    }
  }

  close(){
    this.events.publish('homePublicite:closed', this.pubType);
  }
}