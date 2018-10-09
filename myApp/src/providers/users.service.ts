import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from './constants'

@Injectable()
export class UserService {

  constructor(public http: HttpClient) {

  }

  watchUsers(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_WATCHUSERS, user)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            console.log(err)
            reject(err);
          }
        )

    });
  }

  otherUsers(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_OTHERUSERS, user)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            console.log(err)
            reject(err);
          }
        )

    });
  }

  notInWatchList(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_NOTINWATCH, user)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            console.log(err)
            reject(err);
          }
        )

    });
  }

  allUsers() {
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_GET_ALLUSERS)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  addToWatchListUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDTO_WATCHLIST_USER, data)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  removeFromWatchListUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_REMOVE_WATCHLIST_USER, data)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  addUser(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDUSER, user)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  addPlayerId(player) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDPLAYER, player)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  getPlayerId(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GETPLAYER, user)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  assignedByMeUsers(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ASSIGNED_BY_ME, user)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

}
