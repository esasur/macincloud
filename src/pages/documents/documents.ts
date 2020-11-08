// import {Platform} from 'ionic-angular';
import {Component} from '@angular/core';
import {DocumentsList} from './documents-list';



// @Component({
//   templateUrl: 'documents.html'
// })
// export class Documents{

//   public tab1: any;
//   public tab2: any;

//   constructor() {
//     // définit les tabs
//     this.tab1 = DocumentsList;
//     this.tab2 = DocumentsList;
//   }
// }


@Component({
  templateUrl: 'documents.html'
})
export class Documents{

  public categoryId: any;

  constructor() {
  	this.categoryId = 57;
  }
}