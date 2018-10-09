import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from './constants'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

/*
  Generated class for the AppointmentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskService {
  db : any;
  constructor(public http: HttpClient, private sqlite: SQLite, public platform: Platform) {

  }

  openDb(){
    return this.sqlite.create({
      name: 'todo',
      location: 'default',
      createFromLocation: 1
    }).then((db: SQLiteObject) => {
      this.db = db;
    }).catch(e => console.log("executing error open taskService -> ", JSON.stringify(e)));
  }

  getDbInstance(){
    return this.db;
  }

  // taskOfUser(user, db){
  //   return new Promise((resolve, reject) => {
  //       // db.executeSql('SELECT grp.title AS grpTitle, grp.description, task.* FROM (SELECT * FROM tasks where assigned_to = ? or assigned_by = ?) AS task INNER JOIN groups grp ON task.groupId = grp.idgroup', [user.phone_number, user.phone_number]).then(res => {
  //       //   console.log("executing success select taskofuser", JSON.stringify(res));
  //       //   resolve(res);
  //       //  }).catch(e => {
  //       //    console.log("executing error select taskofuser ->", JSON.stringify(e))
  //       //    reject(e);
  //       //   })
  // });
  // }

  addtask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDTASK, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          }
        )

    });
  }

  addSelfTask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDSELFTASK, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          }
        )

    });
  }

  updatetask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_UPDATETASK, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          }
        )

    });
  }

  taskOfUser(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_TASKOFUSER, user)
        .subscribe(res => {
           resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  taskAssignedToUser(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_TASK_ASSIGNEDTO_USER, user)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  taskAssignedByUser(user) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_TASK_ASSIGNEDBY_USER, user)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  getOneTaskDetails(taskId) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_GET_ONE_TASK, taskId)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  sendTaskSMS(smsData) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_SENDSMS, smsData)
        .subscribe(data => {
          resolve(data)
        },
          err => {
            reject(err);
          })
    })
  }

  sendNotification(notification) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_SENDNOTIFICATION, notification)
        .subscribe(data => {
          resolve(data)
        },
          err => {
            reject(err);
          })
    })
  }

  markAsComplete(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_MARK_COMPLETE, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  markAsActive(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_MARK_ACTIVE, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  deleteTask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_DELETETASK, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }

  delete_AssignTask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_DELETE_ASSIGN_TASK, task)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject(err);
          })
    })
  }


}
