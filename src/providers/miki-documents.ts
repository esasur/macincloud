import {Injectable} from '@angular/core';  
import {Http} from '@angular/http';

@Injectable()
export class MikiDocumentsService {

  public documents: any = false;

  constructor(private http: Http) {
    this.init();
  }


  init(){
    // si on a déjà récupéré l'info une fois on ne va pas la rechercher une seconde fois
    if (this.documents){
      return Promise.resolve(this.documents);
    }

    // sinon on va la rechercher dans le stockage
    return new Promise((resolve, reject) => {
     
      this.getDocuments().then(data => {
        resolve(this.documents);
      });
               
    });
  }


  /**
   * Récupère les documents. Permet de définir l'id de la catégorie à récupérer. Si vide, récupert tous les documents
   */
  getDocuments(idCategory?: any) {

    // retourne une promise
    return new Promise((resolve, reject) => {

      if (idCategory != undefined && idCategory != '') {
        this.http.get('https://asur-formation.ch/api/documents/' + idCategory).subscribe(
          data => {
            this.documents = Array();
            this.documents[idCategory] = data.json().documents;

            resolve(this.documents);
          },
          err => {
            resolve(false);
          }/*,
          () => console.log('Authentication Complete')*/
        );
      }
      else{
        this.http.get('https://asur-formation.ch/api/documents').subscribe(
          data => {
            let documents = data.json().documents;

            if (this.documents == false){
              this.documents = Array();
            }

            for (let doc of documents){
              if (this.documents[doc.id_category] == undefined){
                this.documents[doc.id_category] = Array();
              }

              this.documents[doc.id_category].push(doc);
            }

            resolve(this.documents);
          },
          err => {
            resolve(false);
          }
        );
      }
    });
  }
}