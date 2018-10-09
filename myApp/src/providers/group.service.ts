import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from './constants'

@Injectable()
export class GroupService {

  constructor(public http: HttpClient) {
      
  }

  allGroups(){
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_GET_ALLGROUPS)
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

  taskOfGroup(group){
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_TASKOFGROUP, group)
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

  addGroup(group){
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADD_GROUP, group)
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

  deleteGroup(group){
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_DELETE_GROUP, group)
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

  
}
