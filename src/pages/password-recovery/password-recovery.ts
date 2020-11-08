import {ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
// import {, AbstractControl} from '@angular/common';
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {ValidationService} from '../../providers/validation';
import {MikiPersonService} from '../../providers/miki-person';


@Component({
  templateUrl: 'password-recovery.html',
  selector: 'password-recovery'
})
export class PasswordRecovery{

  authForm: FormGroup;
  email: any;
  password: any;

  constructor(private toastCtrl: ToastController, private mikiPerson: MikiPersonService) {

    this.authForm = new FormGroup({  
      email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(value: any): void {
    if(this.authForm.valid){
      
      this.mikiPerson.testConnection(value.email, value.password).then(data => {

        // si erreur
        if (data == false){
          let toast = this.toastCtrl.create({
            message: "Échec lors de l'authentification.\n\rVeuillez contrôler votre nom d'utilisateur et votre mot de passe.",
            duration: 3000
          });
          toast.present();
        }
      });
    }
  }
}