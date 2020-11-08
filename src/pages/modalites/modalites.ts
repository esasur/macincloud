import {NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';


// modal pour les modalités
@Component({
  templateUrl: 'modalites.html',
  selector: 'modalites',
})
export class Modalites {
  public title: string = '';
  public text: string = '';

  constructor(private viewCtrl: ViewController, private params: NavParams) {
    this.title = this.params.get('title');
    this.text = this.params.get('text');
  }
  close() {
    this.viewCtrl.dismiss();
  }
}