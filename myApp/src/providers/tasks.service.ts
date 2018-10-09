import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from './constants'
import { resolveDefinition } from '../../node_modules/@angular/core/src/view/util';
/*
  Generated class for the AppointmentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskService {

  constructor(public http: HttpClient) {

  }

  addtask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDTASK, task)
        .subscribe(res => {
          console.log(res)
          resolve(res);
        },
          err => {
            console.log(err)
            reject(err);
          }
        )

    });
  }

  addSelfTask(task) {
    return new Promise((resolve, reject) => {
      this.http.post(Constants.URL_ADDSELFTASK, task)
        .subscribe(res => {
          console.log(res)
          resolve(res);
        },
          err => {
            console.log(err)
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
            console.log(err)
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
