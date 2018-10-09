import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from './constants'
import { resolveDefinition } from '../../node_modules/@angular/core/src/view/util';

@Injectable()
export class DiscussionService {

  constructor(public http: HttpClient) {

  }

  watchDiscussions(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_WATCHDISCUSSIONS, user)
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

  otherDiscussions(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_OTHERDISCUSSIONS, user)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            console.log(err)
            reject(err);
          })
    });
  }

  addDiscussion(discussion) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDDISCUSSION, discussion)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  addToWatchListDiscussion(data) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDTO_WATCHLIST_DISCUSSION, data)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  removeFromWatchListDiscussion(data) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_REMOVE_WATCHLIST_DISCUSSION, data)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  addMessages(message) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDMESSAGE, message)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

  getMessages(discussion) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GETMESSAGE, discussion)
      .subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

}
