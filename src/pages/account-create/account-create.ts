import {ToastController, Events, ModalController} from 'ionic-angular';
import {Component} from '@angular/core';
// import {AbstractControl} from '@angular/common';
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';

import {ValidationService} from '../../providers/validation';
import {MikiPersonService} from '../../providers/miki-person';
import {MikiPubliciteService} from '../../providers/miki-publicite';
import {Modalites} from '../modalites/modalites';


@Component({
  templateUrl: 'account-create.html',
  selector: 'account-create',
})
export class AccountCreate{
  public createAccountForm: FormGroup;
  public lastname: FormControl;
  public firstname: FormControl;
  public email: FormControl;
  public password: FormControl;
  public password2: FormControl;
  public createAccountConditions: FormControl;
  public formSubmitedInvalid: boolean = false;

  constructor(private mikiPerson: MikiPersonService, public mikiPublicite: MikiPubliciteService, private events: Events, public toastCtrl: ToastController, private modalCtrl: ModalController, private http: Http) {

    this.createAccountForm = new FormGroup({  
      lastname: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      passwords: new FormGroup({
        password: new FormControl('', Validators.required),
        password2: new FormControl('', Validators.required)
      }, ValidationService.passwordConfirmationValidator),
      createAccountConditions: new FormControl(false, ValidationService.checkboxValidator)
    });
  }

  onSubmit(value: any): void {
    console.log(this.createAccountForm);
    if(this.createAccountForm.valid){

      // créé le compte utilisateur
      this.mikiPerson.createAccount(value).then(data => {
        
        if (data.result == 1){
          this.events.publish('account:created');

          let toast = this.toastCtrl.create({
            message: 'Création de compte réussie',
            duration: 3000
          });

          toast.onDidDismiss(() => {
            this.events.publish('account:createdOk');
          });

          toast.present();
        }
        else{
          let toast = this.toastCtrl.create({
            message: 'Erreur lors de la création du compte : ' + data.error,
            duration: 3000
          });

          toast.onDidDismiss(() => {
            // this.events.publish('account:created');
          });

          toast.present();
        }
      });
    }
    else{
      this.formSubmitedInvalid = true;
    }
  }

  // affiche les modalités pratiques
  openConditions(){
    let pageName = 'conditions_utilisation_compte';

    this.http.get('https://asur-formation.ch/api/page/' + pageName).subscribe(
      data => {
        let modal = this.modalCtrl.create(Modalites, {
          title: "Conditions d'utilisation",
          text: data.json().content
        });
        modal.present();
      },
      err => {
        console.log('error', err);
      }/*,
      () => console.log('Authentication Complete')*/
    );

  }
}