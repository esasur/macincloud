import {Injectable} from '@angular/core';  
import {Http, Headers} from '@angular/http';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Injectable()
export class MikiPubliciteService {

  public publicites: any = false;
  private cursorFcTop: number = 0;
  private cursorFcHome: number = 0;
  private cursorPsTop: number = 0;
  private cursorPsHome: number = 0;
  private cursorStart: number = 0;
  private timerTop: any = false;
  private timerHome: any = false;



  constructor(private platform: Platform, private http: Http, private storage: Storage) {
    platform.ready().then(() => {     
      // récupert les publicités
      this.init();
    });

	}



  init(){
    // si on a déjà récupéré l'info une fois on ne va pas la rechercher une seconde fois
    if (this.publicites){
      return Promise.resolve(this.publicites);
    }

    // sinon on va la rechercher dans le stockage
    return new Promise((resolve, reject) => {

      this.platform.ready().then(() => {

        this.storage.get('publicites').then((publicites) => {

          // si on a trouvé les publicités
          if (publicites != undefined){
            this.publicites = JSON.parse(publicites);
            resolve(this.publicites);
          }
          // sinon on va les récupérer online (pour tous les types de pub)
          else{
            // console.log('get pub');
            this.getPublicites(2, true, true).then(data => {
              this.getPublicites(3, true, true).then(data => {
                this.getPublicites(4, true, true).then(data => {
                  this.getPublicites(5, true, true).then(data => {
                    this.getPublicites(6, true, true).then(data => {
                      resolve(this.publicites);
                      // console.log(this.publicites);
                    });
                  });
                });
              });
            });
          }
        });
      });
    });
  }



  // raffraichit la liste des publicités
  refresh(){
    // sinon on va la rechercher dans le stockage
    return new Promise((resolve, reject) => {
      this.getPublicites(2, true, true).then(data => {
          this.getPublicites(3, true, true).then(data => {
            this.getPublicites(4, true, true).then(data => {
              this.getPublicites(5, true, true).then(data => {
                this.getPublicites(6, true, true).then(data => {
                  resolve(this.publicites);
                });
              });
            });
          });
        });
    });
  }



  /**
   * Récupère les publicité. Permet de définir l'id de la catégorie à récupérer. Si vide, récupert tous les events
   *
   * type : 1 = toutes les publicités; 2 = uniquement les publicités pour 'Formation Continue - Accueil'; 3 = uniquement les publicités pour 'Formation Continue - Haut'; 
   *        4 = uniquement les publicités pour '1ers Secours - Accueil'; 5 = uniquement les publicités pour '1ers Secours - Haut'; 
            6 = uniquement les publicités pour le démarrage de l'application
   * work : si TRUE, on renvoie uniquement les publicités actives et pondérées
   * refresh : si on veut rafraichir les données si elles existent déjà. FALSE par défaut.
   */
  getPublicites(type: number, work = false, refresh = false) {
    let pubs : any;
    let request = '';

    if (type == 1) {
      request = 'https://asur-formation.ch/api/ad';
    }
    else if(type == 2) {
      request = 'https://asur-formation.ch/api/ad/53';
    }
    else if(type == 3) {
      request = 'https://asur-formation.ch/api/ad/56';
    }
    else if(type == 4) {
      request = 'https://asur-formation.ch/api/ad/54';
    }
    else if(type == 5) {
      request = 'https://asur-formation.ch/api/ad/55';
    }
    else if(type == 6) {
      request = 'https://asur-formation.ch/api/ad/52';
    }


    // retourne une promise
    return new Promise((resolve, reject) => {

      // si on a déjà récupéré les pubs et qu'on ne doit pas les rafraichir
      if (!refresh && this.publicites){
        return resolve(this.publicites);
      }

      // sinon on récupert les publicités
      pubs = this.http.get(request).subscribe(
        data => {
          pubs = data.json();

          if (pubs.result == 0){
            resolve(false);
          }

          pubs = pubs.publicites;

          // si on doit traiter les publicités
          if (work == true){
            var temp = [];
             
            // parcourt toutes les publicités
            for (let pub of pubs){
              if (pub.hasOwnProperty('state') && pub.hasOwnProperty('weight') && pub.state == 1){
                // ajoute X fois la publicité au résultat, X étant égal au poid de la publicité
                for (let x = 0; x < pub.weight; x++){
                  temp.push(pub);
                }
              }
            }

            // mélange le tableau
            temp = this.shuffle(temp);

            if (!this.publicites){ 
              this.publicites = {}; 
            }

            // enregistre les publicités
            if (type == 2) {
              this.publicites['fc_home'] = temp;
            }
            else if (type == 3) {
              this.publicites['fc_top'] = temp;
            }
            else if (type == 4) {
              this.publicites['ps_home'] = temp;
            }
            else if (type == 5) {
              this.publicites['ps_top'] = temp;
            }
            else if (type == 6) {
              this.publicites['start'] = temp;
            }

            if (this.storage){
              this.storage.set('publicites', JSON.stringify(this.publicites));
            }

            resolve(temp);
          }
          // si on ne doit pas traiter les publicités
          else{
            resolve(pubs);
          }
        },
        err => {
          console.error(err);
          resolve(false);
        }
      );
    });
  }



  /** 
   * Comptabilise une vue d'une publicité dans les statistiques
   * 
   * pubId : id de la publicité
   * type : 1 = view; 2 = clic;
   */
  addStat(pubId, type): any{
    let params = "";

    // params += 'pubId=' + pubId;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // détermine le type de statistique
    if (type == 1){
      type = "view";
    }
    else if (type == 2){
      type = "clic";
    }
    else{
      return(false);
    }



    // retourne une promise
    return new Promise((resolve, reject) => {

      this.http.post('https://es-asur.ch/api/index.php/events/publicite/' + type + '/' + pubId + '/', params, { headers: headers }).subscribe(
        data => {
          resolve(data.json());
        },
        err => {
          console.error(err);
          resolve(false);
        }/*,
        () => console.log('Authentication Complete')*/
      );   
    });
  }



  // définit le chemin de l'image d'une publicité
  getPath(el){
    let max_width = window.innerWidth;

    let thumb = '';
    if (max_width <= 100)
      thumb = '100/';
    else if (max_width <= 200)
      thumb = '200/';
    else if (max_width <= 500)
      thumb = '500/';
    else if (max_width <= 1000)
      thumb = '1000/';
    else if (max_width <= 1500)
      thumb = '1500/';
    else
     thumb = '';

    return 'https://asur-formation.ch/' + el.pictures[0].folder + thumb + el.pictures[0].filename;
  }



  // affiche la prochaine image de type "type"
  current(type){
    let pub = null;

    // si les publicités n'ont pas encore été chargées, on les charge
    if ((type == 'fc_home' && this.publicites.fc_home == undefined) ||
        (type == 'fc_top' && this.publicites.fc_top == undefined) || 
        (type == 'ps_home' && this.publicites.ps_home == undefined) ||
        (type == 'ps_top' && this.publicites.ps_top == undefined) || 
        (type == 'start' && this.publicites.ps_top == undefined)){

      this.refresh().then(data => {
        this.current(type);
      });
    }
    // puis on affiche la pub
    else{
      if (type == 'fc_home'){
        pub = this.publicites.fc_home[this.cursorFcHome];
        return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
      }
      else if (type == 'fc_top'){
        pub = this.publicites.fc_top[this.cursorFcTop];
        return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
      }
      else if (type == 'ps_home'){
        pub = this.publicites.ps_home[this.cursorPsHome];
        return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
      }
      else if (type == 'ps_top'){
        pub = this.publicites.ps_top[this.cursorPsTop];
        return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
      }
      else if (type == 'start'){
        pub = this.publicites.start[this.cursorStart];
        return "<a href='" + pub.web + "' target='_blank'><img src='" + this.getPath(pub) + "' /></a>";
      }
    }

  }




  // passe à la prochaine image de type "type"
  next(type){
    if (type == 'fc_home'){
      this.cursorFcHome = (this.cursorFcHome + 1) % this.publicites.fc_home.length;
    }
    else if (type == 'fc_top'){
      this.cursorFcTop = (this.cursorFcTop + 1) % this.publicites.fc_top.length;
    }
    else if (type == 'ps_home'){
      this.cursorPsHome = (this.cursorPsHome + 1) % this.publicites.ps_home.length;
    }
    else if (type == 'ps_top'){
      this.cursorPsTop = (this.cursorPsTop + 1) % this.publicites.ps_top.length;
    }
    else if (type == 'start'){
      this.cursorStart = (this.cursorStart + 1) % this.publicites.start.length;
    }
  }



  // démarre le timer de type "type"
  start(type){
    let publicite = this;
    if (type == 'fc_home'){
      this.timerHome = setInterval(function(){ publicite.next(type); }, 3000);
    }
    else if (type == 'fc_top'){
      this.timerTop = setInterval(function(){ publicite.next(type); }, 3000);
    }
    else if (type == 'ps_home'){
      this.timerHome = setInterval(function(){ publicite.next(type); }, 3000);
    }
    else if (type == 'ps_top'){
      this.timerTop = setInterval(function(){ publicite.next(type); }, 3000);
    }
    else if (type == 'start'){
      this.timerHome = setInterval(function(){ publicite.next(type); }, 3000);
    }
  }



  // arrête le time de type "type"
  stop(type){
    if (type == 'fc_home' || type == 'ps_home' || type == 'start'){
      clearInterval(this.timerHome);
    }
    else if (type == 'fc_top' || type == 'ps_top'){
      clearInterval(this.timerTop);
    }
  }



  /**
   * Shuffles array in place.
   * @param {Array} a items The array containing the items.
   */
  shuffle(a): any{
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }

    return a;
  }
}