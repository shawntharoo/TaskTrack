import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from './constants';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
/*
  Generated class for the AppointmentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthService {

  constructor(public http: HttpClient, public afAuth: AngularFireAuth) {

  }

  receiveSMS(contact) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_REGISTER, contact)
        .subscribe(data => {
          resolve(data)
        },
          err => {
            reject(err);
          }
        )
    })
  }
  addPlayerId(playerData) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADD_PLAYERID, playerData)
        .subscribe(data => {
          resolve(data)
        },
          err => {
            reject(err);
          }
        )
    })
  }
  verifyToken(userData) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_VERIFY, userData)
        .subscribe(data => {
          resolve(data)
        },
          err => {
            reject(err);
          }
        )
    })
  }
  getPlayerId(userData) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_PLAYERID, userData)
        .subscribe(data => {
          resolve(data)
        },
          err => {
            reject(err);
          }
        )
    })
  }

  signInWithGoogle(): Promise<any> {
    console.log('Sign in with google');
    return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  private oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      if (document.URL.startsWith('http://54.149.85.163/ToDo/') || document.URL.startsWith('http://localhost/ToDo/')) {
        return this.afAuth.auth.signInWithPopup(provider);
      }
      else {


        return this.afAuth.auth.signInWithRedirect(provider)
          .then((res) => {
            console.log("first res -> ", JSON.stringify(res))
            return this.afAuth.auth.getRedirectResult().then(result => {
              console.log("second res -> ", JSON.stringify(result))
              // This gives you a Google Access Token.
              // You can use it to access the Google API.
              let token = result.credential['accessToken'];
              // The signed-in user info.
              let user = result.user;
              console.log(token, user);
            }).catch(function (error) {
              console.log("second error -> ", JSON.stringify(error))
              // Handle Errors here.
              alert(error.message);
            });
          }).catch(function (error) {
            console.log("first error -> ", JSON.stringify(error))
            // Handle Errors here.
            alert(error.message);
          });

          
      }
    }
  }


}
