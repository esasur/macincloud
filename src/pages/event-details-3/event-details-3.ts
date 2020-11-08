import {App, NavParams, ToastController, ModalController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
// import {AbstractControl} from '@angular/common';
// import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MikiEventsService} from '../../providers/miki-events';
import {MikiPubliciteService} from '../../providers/miki-publicite';
import {ValidationService} from '../../providers/validation';
import {Modalites} from '../modalites/modalites';
import {Login} from '../login/login';
import {Http} from '@angular/http';




@Component({
  templateUrl: 'event-details-3.html',
  selector: 'event-details-3'
})
export class EventDetails3 {
  public myEvent: any;
  public user: any;

  private loginPage: any = Login;

  public eventPrices: any = [];
  public priceId: any = '';
  public choosenPriceId: any = '';
  public msgParticipants: any = '';
  public accompanist: any = '';
  public codeAutorises: any = '';
  public eventSubscription: any = '';
  public subscriptionState: number = 0;
  public stateSubscription: number;
  public eventPublicType: number;
  public codesPros: any = [];
  public countries: any = [];
  public userBirthdayArray: any;

  public eventSubscribeForm: FormGroup;
  
  public days = [];
  public months = [];
  public years = [];

  public subscriptionPriceId: FormControl;
  public subscriptionType: FormControl;
  public subscriptionLastname: FormControl;
  public subscriptionFirstname: FormControl;
  public subscriptionBirthday_day: FormControl;
  public subscriptionBirthday_month: FormControl;
  public subscriptionBirthday_year: FormControl;
  public subscriptionAddressBillingType: FormControl;
  public subscriptionAddressMailingType: FormControl;
  public subscriptionPrivateAddress: FormControl;
  public subscriptionPrivateNpa: FormControl;
  public subscriptionPrivateCity: FormControl;
  public subscriptionPrivateCountry: FormControl;
  public subscriptionPrivateMobile: FormControl;
  public subscriptionPrivateFixe: FormControl;
  public subscriptionPrivateEmail: FormControl;
  public subscriptionProCompany: FormControl;
  public subscriptionProCompanyCode: FormControl;
  public subscriptionProCompanyCodeOther: FormControl;
  public subscriptionProAddress: FormControl;
  public subscriptionProNpa: FormControl;
  public subscriptionProCity: FormControl;
  public subscriptionProCountry: FormControl;
  public subscriptionProTel: FormControl;
  public subscriptionProFax: FormControl;
  public subscriptionProEmail: FormControl;
  public subscriptionComment: FormControl;
  public subscriptionConditions: FormControl;


  constructor(private app: App, private toastCtrl: ToastController, private modalCtrl: ModalController, private navParams: NavParams, private events: MikiEventsService, public mikiPublicite: MikiPubliciteService, private http: Http, private e: Events) {
    // récupert l'event passé en paramètre
    this.myEvent = this.navParams.data.myEvent;

    // ainsi que l'état de la connexion de l'utilisateur
    this.user = this.navParams.data.user;


    // puis récupert les informations dont on a besoin :

    // les prix de l'event
    for(let myPrice of this.myEvent.prices){
      let priceName = myPrice.price;

      if (myPrice.title.fr != ''){
        priceName = myPrice.title.fr + ' - ' + priceName;
      }

      this.eventPrices.push({id: myPrice.id, title: myPrice.title.fr, description: myPrice.description.fr, price: myPrice.price, priceName: priceName});
    };

    // le nombre max de participants ou de places restantes
    if (this.myEvent.max_participants == 0){
      this.msgParticipants = "illimité";
    }
    else{
      this.msgParticipants = (this.myEvent.max_participants - this.myEvent.nb_participants) + " places restantes";
    }

    // le nombre d'accompagnants autorisés
    this.accompanist = this.myEvent.accompanist;


    // la liste des codes professionnels autorisés pour l'event
    if (this.myEvent.others.code_autorises && this.myEvent.others.code_autorises.trim() != ''){
      this.codeAutorises = this.myEvent.others.code_autorises.trim().split(',');
      for(let i = 0; i < this.codeAutorises.length; i++) {
        this.codeAutorises[i] = this.codeAutorises[i].trim();
      }
    }
    else{
      this.codeAutorises = "";
    }
    
    // la liste des codes professionnels
    this.events.getCodesPros().subscribe(
      data => {
        let codes = data.json().codes;

        // si il n'y a pas de restriction au niveau des codes professionnels on les permet tous
        if (this.codeAutorises == ''){
          this.codesPros = codes;
        }
        // sinon on ne permet que les codes autorisés
        else{
          this.codesPros = [];
          for(let i = 0; i < codes.length; i++) {
            if(this.arrayContains(this.codeAutorises, codes[i].numero)){
              this.codesPros.push(codes[i]);
            }
          }
        }

        // recherche le nom du code profesionnel de l'utilisateur
        if (this.user){
          this.user.company_code_name = '';

          // pour savoir si on doit prendre le code personnalisé (autre) ou pas
          for(let i = 0; i < codes.length; i++) {
            if(codes[i].numero == this.user.others.company_code){
              this.user.company_code_name = codes[i].nom;
              this.eventSubscribeForm.controls.subscriptionProCompanyCode.setValue(this.user.others.company_code);
            }
          }

          // affecte le bon code professionnel
          if (this.user.company_code_name == ''){
            this.eventSubscribeForm.controls.subscriptionProCompanyCode.setValue(99);
            this.eventSubscribeForm.controls.subscriptionProCompanyCodeOther.setValue(this.user.others.company_code);
            this.user.company_code_name = this.user.others.company_code;
          }
        }
      },
      err => console.error(err),
      () => {}
    );

    // la liste des pays
    this.events.getCountries().subscribe(
      data => {
        this.countries = data.json().countries;

        if (this.user){
          this.user.countryName = '';
          this.user.company.countryName = '';
        }

        let france_index = null;
        let suisse_index = null;

        // recherche le nom du pays de l'utilisateur
        for(let i = 0; i < this.countries.length; i++) {
          if (this.user){
            if(this.countries[i].id == this.user.country){
              this.user.countryName = this.countries[i].name.fr;
            }
            if(this.countries[i].id == this.user.company.country){
              this.user.company.countryName = this.countries[i].name.fr;
            }
          }

          if (this.countries[i].name.fr == 'France'){
            france_index = i;
          }

          if (this.countries[i].name.fr == 'Suisse'){
            suisse_index = i;
          }
        }

        // place la Suisse et la France en début de tableau
        if (france_index != null){
          let temp = this.countries[france_index];
          this.countries.splice(france_index, 1);
          this.countries.unshift(temp);
        }

        if (suisse_index != null){
          let temp = this.countries[suisse_index];
          this.countries.splice(suisse_index, 1);
          this.countries.unshift(temp);
        }
      },
      err => console.error(err),
      () => {}
    );              

    // si l'event est de type public ou privé
    if (this.myEvent.others.hasOwnProperty('public_type')){
      this.eventPublicType = this.myEvent.others.public_type;
    }
    else{
      this.eventPublicType = 0;
    }

    // si l'utilisateur est connecté, on vérifie s'il est déjà inscrit à l'event
    if (this.user){
      this.events.isSubscribed(this.myEvent.id, this.user.id).subscribe(
        data => {
          this.subscriptionState = data.json().state;

          // met à jour l'affichage du formulaire d'inscription en fonction de différents paramètres
          this.updateSubscriptionView();
        },
        err => console.error(err),
        () => {}
      );
    }

    // la configuration générale des inscriptions aux events
    this.eventSubscription = this.myEvent.event_subscription;

    // initialise le forumlaire
    this.initForm();

    // met à jour l'affichage du formulaire d'inscription en fonction de différents paramètres
    this.updateSubscriptionView();
  }



  // initialise le formulaire
  initForm(){

    // prépare les données pour la date de naissance
    for (let i = 1; i <= 31; i++){
      this.days.push(i);
    }

    this.months[1] = "Janvier";
    this.months[2] = "Février";
    this.months[3] = "Mars";
    this.months[4] = "Avril";
    this.months[5] = "Mai";
    this.months[6] = "Juin";
    this.months[7] = "Juillet";
    this.months[8] = "Août";
    this.months[9] = "Septembre";
    this.months[10] = "Octobre";
    this.months[11] = "Novembre";
    this.months[12] = "Décembre";

    let now = new Date();
    let yearNow = now.getFullYear();
    for (let i = yearNow - 10; i > yearNow - 100; i--){
      this.years.push(i);
    }

    // récupert la date de naissance de l'utilisateur
    if (this.user){
      this.userBirthdayArray = this.user.birthday.split('/');
      
      if (this.userBirthdayArray.length != 3){
        this.userBirthdayArray = ['', '', ''];
      }

      this.eventSubscribeForm = new FormGroup({
        
        subscriptionType: new FormControl(this.user.type, Validators.required),
        subscriptionLastname: new FormControl(this.user.lastname, Validators.required),
        subscriptionFirstname: new FormControl(this.user.firstname, Validators.required),
        subscriptionBirthday_day: new FormControl(this.userBirthdayArray[0], Validators.required),
        subscriptionBirthday_month: new FormControl(this.userBirthdayArray[1], Validators.required),
        subscriptionBirthday_year: new FormControl(this.userBirthdayArray[2], Validators.required),
        subscriptionAddressBillingType: new FormControl(this.user.others.type_adresse_facturation, Validators.required),
        subscriptionAddressMailingType: new FormControl(this.user.others.type_adresse_courrier, Validators.required),
        subscriptionPrivateAddress: new FormControl(this.user.address, Validators.required),
        subscriptionPrivateNpa: new FormControl(this.user.npa, Validators.required),
        subscriptionPrivateCity: new FormControl(this.user.city, Validators.required),
        subscriptionPrivateCountry: new FormControl(this.user.country, Validators.required),
        subscriptionPrivateMobile: new FormControl(this.user.tel2, Validators.required),
        subscriptionPrivateFixe: new FormControl(this.user.tel1),
        subscriptionPrivateEmail: new FormControl(this.user.email1, [Validators.required, ValidationService.emailValidator]),
        subscriptionProCompany: new FormControl(this.user.company.name, Validators.required),
        subscriptionProCompanyCode: new FormControl(this.user.others.company_code, Validators.required),
        subscriptionProCompanyCodeOther: new FormControl(''),
        subscriptionProAddress: new FormControl(this.user.company.address, Validators.required),
        subscriptionProNpa: new FormControl(this.user.company.npa, Validators.required),
        subscriptionProCity: new FormControl(this.user.company.city, Validators.required),
        subscriptionProCountry: new FormControl(this.user.company.country, Validators.required),
        subscriptionProTel: new FormControl(this.user.company.tel, Validators.required),
        subscriptionProFax: new FormControl(this.user.company.fax),
        subscriptionProEmail: new FormControl(this.user.company.email, [Validators.required, ValidationService.emailValidator]),
        subscriptionComment: new FormControl(this.user.subscriptionComment),
        subscriptionConditions: new FormControl(false, ValidationService.checkboxValidator)
      });

      // si l'inscription est payante, on rend obligatoire le choix du prix
      if (this.myEvent.entrance_type == 1){
        this.eventSubscribeForm.addControl(
          'subscriptionPriceId', new FormControl(this.eventPrices[0] != undefined ? this.eventPrices[0].id : '', Validators.required)
        );
      }
    }
    else{
      this.eventSubscribeForm = new FormGroup({
        subscriptionPriceId: new FormControl('', Validators.required),
        subscriptionType: new FormControl('', Validators.required),
        subscriptionLastname: new FormControl('', Validators.required),
        subscriptionFirstname: new FormControl('', Validators.required),
        subscriptionBirthday_day: new FormControl('', Validators.required),
        subscriptionBirthday_month: new FormControl('', Validators.required),
        subscriptionBirthday_year: new FormControl('', Validators.required),
        subscriptionAddressBillingType: new FormControl('Choisir', Validators.required),
        subscriptionAddressMailingType: new FormControl('', Validators.required),
        subscriptionPrivateAddress: new FormControl('', Validators.required),
        subscriptionPrivateNpa: new FormControl('', Validators.required),
        subscriptionPrivateCity: new FormControl('', Validators.required),
        subscriptionPrivateCountry: new FormControl('', Validators.required),
        subscriptionPrivateMobile: new FormControl('', Validators.required),
        subscriptionPrivateFixe: new FormControl(''),
        subscriptionPrivateEmail: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        subscriptionProCompany: new FormControl('', Validators.required),
        subscriptionProCompanyCode: new FormControl('', Validators.required),
        subscriptionProCompanyCodeOther: new FormControl(''),
        subscriptionProAddress: new FormControl('', Validators.required),
        subscriptionProNpa: new FormControl('', Validators.required),
        subscriptionProCity: new FormControl('', Validators.required),
        subscriptionProCountry: new FormControl('', Validators.required),
        subscriptionProTel: new FormControl('', Validators.required),
        subscriptionProFax: new FormControl(''),
        subscriptionProEmail: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        subscriptionComment: new FormControl(''),
        // subscriptionConditions: new FormControl('', Validators.required)
        subscriptionConditions: new FormControl(false, ValidationService.checkboxValidator)
      });
    }

    // si c'est un cours de type privé, on prend automatiquement l'adresse privée pour l'adresse de facturation et de correspondance
    if (this.eventPublicType == 1){
      this.eventSubscribeForm.controls.subscriptionAddressBillingType.setValue("Privée");
      this.eventSubscribeForm.controls.subscriptionAddressMailingType.setValue("Privée");
    }


    // sélectionne la suisse par défaut si aucun pays défini
    if (!this.user || this.user.country == ''){
      for(let i = 0; i < this.countries.length; i++) {
        if(this.countries[i].name.fr == 'Suisse'){
          this.eventSubscribeForm.controls.subscriptionPrivateCountry.setValue(this.countries[i].id);
        }
      }
    }

    if (!this.user || this.user.company.country == ''){
      for(let i = 0; i < this.countries.length; i++) {
        if(this.countries[i].name.fr == 'Suisse'){
          this.eventSubscribeForm.controls.subscriptionProCountry.setValue(this.countries[i].id);
        }
      }
    }
  }



  // met à jour l'affichage du formulaire d'inscription en fonction de différents paramètres
  updateSubscriptionView(){
    // si les inscriptions sont fermées
    if (this.myEvent.event_subscription == 0){
      this.stateSubscription = 0;
    }
    // si la personne est connectée mais que son code professionnel ne fait pas partie des codes pros autorisés
    else if (this.codeAutorises != '' && this.user && this.user.hasOwnProperty('company_code') && !this.arrayContains(this.codeAutorises, this.user.company_code)){
      this.stateSubscription = 1;
    }
    // si les inscription ne sont ouvertes qu'aux membres et que la personne n'est pas connectée
    else if (this.myEvent.event_subscription == 1 && !this.user){
      this.stateSubscription = 2;
    }
    // si la personne est déjà inscrite
    else if(this.user && this.subscriptionState == 1){
      this.stateSubscription = 3;
    }
    // si la personne est inscrite mais en attente de validation
    else if(this.user && this.subscriptionState == 2){
      this.stateSubscription = 4;
    }
    // sinon, si les inscriptions sont ouvertes à tout le monde ou que le personne est connectée, on affiche le formulaire
    else{
      this.stateSubscription = 5;
    }
  }



  // teste si un tableau contient une valeur donnée
  arrayContains(array: any, value: any){
    for(let i = 0; i < array.length; i++) {
      if(array[i] == value){
        return true;
      }
    }
    return false;
  }



  // affiche les modalités pratiques
  openConditions(){
    let pageName = '';

    if (this.myEvent.category.id == 1){
      pageName = 'modalites-pratiques-fc';
    }
    else if (this.myEvent.category.id == 15){
      pageName = 'modalites-pratiques-1ers-secours';
    }
    else{
      return false;
    }

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



  gotoLogin(){
    this.app.getRootNav().setRoot(this.loginPage);
  }



  onSubmit(value: any): void {
    if(this.eventSubscribeForm.valid){
      value.eventPublicType = this.eventPublicType;

      let userId = '';
      if (this.user){
        userId = this.user.id;
      }


      this.events.subscribe(this.myEvent.id, userId, value).then(data => {
        if (data.result == 1){
          let toast = this.toastCtrl.create({
            cssClass: 'toast-success',
            message: data.msg,
            showCloseButton: true,
            closeButtonText: 'Ok'
          });

          toast.onDidDismiss(() => {
            // console.log('change tab');
            // alert('pass1');
            this.e.publish('event:subscribed');
          })

          toast.present();
        }
        else if (data.result == 0){
          let toast = this.toastCtrl.create({
            cssClass: 'toast-error',
            message: data.error,
            showCloseButton: true,
            closeButtonText: 'Ok'
          });
          toast.present();
        }
      });
    }
  }
}