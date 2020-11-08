import {Injectable} from '@angular/core';  
import {Http, Headers} from '@angular/http';
import {Platform, Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';


@Injectable()
export class MikiPersonService {
	public user: any = false;  // peut être FALSE ou un objet représentant la personne connectée



  constructor(private platform: Platform, private http: Http, private events: Events, private device: Device, private storage: Storage) {
  	platform.ready().then(() => {
      // initialise le stockage
      // this.storage = new Storage(SqlStorage);
      // this.storage = new Storage(LocalStorage);
    });

  	// vérifie si l'utilisateur est connecté
    this.checkConnection().then(data => {
      this.user = data;
    });
	}



  login(person: any){
  	if (typeof person === 'object'){
  		person = JSON.stringify(person);
  	}
 
    this.storage.set('mikiPerson', person);
    this.user = JSON.parse(person);;
    
    this.events.publish('user:login');
  }



  // déconnecte l'utilisateur
  disconnect(){
  	this.user = false;

  	this.events.publish('user:logout');
  	this.storage.remove('mikiPerson');
  }



  // vérifie si l'utilisateur est connecté (promise)
  // si force = TRUE, on raffraichit l'utilisateur soit depuis le stockage, soit depuis la base de données.
  checkConnection(force = false){
  	// si on a déjà récupéré l'info une fois on ne va pas la rechercher une seconde fois
  	if (!force && this.user){
  		return Promise.resolve(this.user);
  	}

  	// sinon on va la rechercher dans le stockage
    return new Promise((resolve, reject) => {

	    this.platform.ready().then(() => {

	      this.storage.get('mikiPerson').then((mikiPerson) => {

          if (mikiPerson == undefined){
            this.user = false;
          }
          else{
  	        let person = JSON.parse(mikiPerson);

  	        // vérifie si c'est bien un objet qui possède au moins un id
  	        if (person.hasOwnProperty('id') && !Number.isNaN(person.id)){
              this.user = person;
  	        }
  	        else{
              this.user = false;
  	        }
          }

          // retourne l'utilisateur
          resolve(this.user);
	      });
	    });
    });
  }



  // raffraichit les données de l'utilisateur
  refreshUser(){
    
    return new Promise((resolve, reject) => {

      this.checkConnection(true).then(data => {
        // this.user = data;
        
        if (this.user){
          
          this.http.get('https://asur-formation.ch/api/persons/' + this.user.id).subscribe(
            data => {
              let datas = data.json();

              if (datas.result == 1){
                this.user = datas.person;
                this.storage.set('mikiPerson', JSON.stringify(this.user));
              }
              else{
                this.user = false;
              }
            },
            err => {
              console.error(err);
              resolve(false);
            }
          );
        }

        // retourne l'utilisateur
        resolve(this.user);
      });
    });
  }



  // fait une tentative de connexion avec un nom d'utilisateur et un mot de passe donné
  testConnection(username: string, password: string): any{
  	// let params = "username=" + username + "&password=" + password;
    let params = "username=" + username + "&password=" + password + "&mobileApp=1";

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise((resolve, reject) => {
      this.http.post('https://asur-formation.ch/api/persons/connect', params, { headers: headers }).subscribe(
        data => {
          let datas = data.json();

          if (datas.result == 1){
            this.login(datas.person);
            resolve(datas.person);
          }
          else{
            resolve(false);
          }
        },
        err => {
        	console.error(err);
        	resolve(false);
        }/*,
        () => console.log('Authentication Complete')*/
      );  
    });
  }



  // modifie les données personnelles d'une personne
  editAccount(personId, datas): any{
    let params = "";
    params += 'params=' + JSON.stringify(datas);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // retourne une promise
    return new Promise((resolve, reject) => {

      this.http.post('https://asur-formation.ch/api/persons/' + personId + '/edit', params, { headers: headers }).subscribe(
        data => {
          resolve(data.json());
        },
        err => {
          console.error(err);
          resolve(datas);
        }/*,
        () => console.log('Authentication Complete')*/
      );   
    });
  }



  // modifie les données personnelles d'une personne
  deleteAccount(personId): any{
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // retourne une promise
    return new Promise((resolve, reject) => {

      this.http.post('https://asur-formation.ch/api/persons/' + personId + '/account_delete', null, { headers: headers }).subscribe(
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



  // créé un nouveau compte utilisateur
  createAccount(datas): any{
    let params = 'params=' + JSON.stringify(datas);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // retourne une promise
    return new Promise((resolve, reject) => {

      this.http.post('https://asur-formation.ch/api/account/create/2', params, { headers: headers }).subscribe(
        dataCreate => {

          // vérifie que la création du compte ait fonctionnée
          if (dataCreate.json().result == 0){
            resolve(dataCreate.json());
          }

          let paramsConnect = "username=" + datas.email + "&password=" + datas.passwords.password;

          // une fois le compte créé, on logue l'utilisateur
          this.http.post('https://asur-formation.ch/api/persons/connect', paramsConnect, { headers: headers }).subscribe(
            dataConnect => {

              let datasConnect = dataConnect.json();

              if (datasConnect.result == 1){
                this.storage.set('mikiPerson', JSON.stringify(datasConnect.person));
                this.user = datasConnect.person;

                resolve(dataCreate.json());
              }
            },
            err => {
              console.error(err);
              return false;
            }
          );          
        },
        err => {
          console.error(err);
          resolve(datas);
        }
      );   
    });
  }



  setPushToken(pushToken: string){
    let datas = {
      pushToken: pushToken,
      pushDevice: this.device.platform
    }
    let params = 'params=' + JSON.stringify(datas);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // retourne une promise
    return new Promise((resolve, reject) => {

      this.http.post('https://asur-formation.ch/api/persons/' + this.user.id + '/edit', params, { headers: headers }).subscribe(
        data => {
          resolve(data.json());
        },
        err => {
          console.error(err);
        }/*,
        () => console.log('Authentication Complete')*/
      );   
    });
  }
}