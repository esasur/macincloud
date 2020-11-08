import {Platform, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {MikiDocumentsService} from '../../providers/miki-documents';


@Component({
  templateUrl: 'documents-list.html',
  selector: 'documents-list',
})
export class DocumentsList {
  private user: boolean = false;
  public categoryId : any = 57;

  constructor(navParams: NavParams, private platform: Platform, public mikiDocuments: MikiDocumentsService) {
    
    // récupert l'utilisateur connecté (passé en paramètres)
    if (navParams.get("user")){
      this.user = navParams.get("user");
    }
    else{
      this.user = false;
    }

    // this.categoryId = JSON.parse(navParams.data).categoryId;
  }
  
  // pour l'ouverture d'un document
  openDoc(url): void{
    if (this.platform.is('ios')){
      window.open('https://asur-formation.ch/' + url, '_blank', 'EnableViewPortScale=yes');
    }
    else{
      window.open('https://asur-formation.ch/' + url, '_system', 'location=yes');
    }
  }
}