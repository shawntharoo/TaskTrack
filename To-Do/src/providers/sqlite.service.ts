import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Constants } from './constants';
/*
  Generated class for the AppointmentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SQLiteService {
  db: any;
  constructor(public http: HttpClient, private sqlite: SQLite) {

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

  getAllTasks(db) {
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_ALL_TASKS)
        .subscribe(res => {
          this.storeAllTasks(res, db);
        },
          err => {
            reject(err);
          }
        )
    });
  }

  getAllUsers(db) {
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_GET_ALLUSERS)
        .subscribe(res => {
          this.storeAllUsers(res, db);
        },
          err => {
            reject(err);
          }
        )
    });
  }

  getAllGroups(db) {
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_GET_ALLGROUPS)
        .subscribe(res => {
          this.storeAllGroups(res, db);
        },
          err => {
            reject(err);
          }
        )
    });
  }

  getAllOnesignalIds(db) {
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_GET_ALLONESIGNALS)
        .subscribe(res => {
          this.storeAllOneSignal(res, db);
        },
          err => {
            reject(err);
          }
        )
    });
  }

  getAllWatchUsers(db) {
    return new Promise((resolve, reject) => {
      this.http.get(Constants.URL_GET_ALLWATCHUSERS)
        .subscribe(res => {
          this.storeAllUserWathing(res, db);
        },
          err => {
            reject(err);
          }
        )
    });
  }

  deleteAllSqliteTables(db){

       db.executeSql('DROP TABLE IF EXISTS tasks', []).then(res => {
        console.log("executing success delete task")
       }).catch(e => console.log("executing error delete task ->", JSON.stringify(e)))

       db.executeSql('DROP TABLE IF EXISTS users', []).then(res => {
        console.log("executing success delete user")
       }).catch(e => console.log("executing error delete user ->", JSON.stringify(e)))

       db.executeSql('DROP TABLE IF EXISTS groups', []).then(res => {
        console.log("executing success delete groups")
       }).catch(e => console.log("executing error delete groups ->", JSON.stringify(e)))

       db.executeSql('DROP TABLE IF EXISTS userwatching', []).then(res => {
        console.log("executing success delete userwatching")
       }).catch(e => console.log("executing error delete userwatching ->", JSON.stringify(e)))

       db.executeSql('DROP TABLE IF EXISTS onesignal_player', []).then(res => {
        console.log("executing success delete onesignal")
       }).catch(e => console.log("executing error delete onesignal ->", JSON.stringify(e)))

  }

  storeAllTasks(allTasks, db) {

       db.executeSql('CREATE TABLE IF NOT EXISTS tasks (idtasks INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, assigned_to TEXT NOT NULL, assigned_by TEXT NOT NULL, title TEXT NOT NULL, description TEXT, groupId INTEGER, status TEXT, due_date TEXT, created_date TEXT, assigned_name TEXT)', [])
        .then(res => {
          for(var i=0; i<allTasks.length; i++){
                var assigned_to = allTasks[i].assigned_to;
                var assigned_by = allTasks[i].assigned_by;
                var title = allTasks[i].title;
                var description = allTasks[i].description;
                var groupId = allTasks[i].groupId;
                var status = allTasks[i].status;
                var due_date = allTasks[i].due_date;
                var created_date = allTasks[i].created_date;
                var assigned_name = allTasks[i].assigned_name;

                db.executeSql('INSERT INTO tasks (assigned_to, assigned_by, title, description, groupId, status, due_date, created_date, assigned_name) VALUES(?,?,?,?,?,?,?,?,?)', [assigned_to, assigned_by, title, description, groupId, status, due_date, created_date, assigned_name]).then(res2 => {
                 
                })
                .catch(e => console.log("executing error insert task-> ", JSON.stringify(e)));
          }
          
        })
        .catch(e => console.log("executing error create task-> ", JSON.stringify(e)));
  }

  storeAllUsers(allUsers, db) {

       db.executeSql('CREATE TABLE IF NOT EXISTS users (idusers INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, phone_number TEXT NOT NULL, country_code TEXT, firstname TEXT, lastname TEXT)', [])
        .then(res => {
          for(var i=0; i<allUsers.length; i++){
                var phone_number = allUsers[i].phone_number;
                var country_code = allUsers[i].country_code;
                var firstname = allUsers[i].firstname;
                var lastname = allUsers[i].lastname;

                db.executeSql('INSERT INTO users (phone_number, country_code, firstname, lastname) VALUES(?,?,?,?)', [phone_number, country_code, firstname, lastname]).then(res2 => {
                  
                })
                .catch(e => console.log("executing error insert user-> ", JSON.stringify(e)));
          }
          
        })
        .catch(e => console.log("executing sql for create user-> ", JSON.stringify(e)));
  }

  storeAllGroups(allGroups, db) {

       db.executeSql('CREATE TABLE IF NOT EXISTS groups (idgroup INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, description TEXT, phone_number TEXT)', [])
        .then(res => {
          for(var i=0; i<allGroups.length; i++){
                var title = allGroups[i].title;
                var description = allGroups[i].description;
                var phone_number = allGroups[i].phone_number;

                db.executeSql('INSERT INTO groups (title, description, phone_number) VALUES(?,?,?)', [title, description, phone_number]).then(res2 => {
                  
                })
                .catch(e => console.log("executing error insert group-> ", JSON.stringify(e)));
          }
          
        })
        .catch(e => console.log("executing sql for create group-> ", JSON.stringify(e)));
  }

  storeAllUserWathing(allUserWatching, db) {

       db.executeSql('CREATE TABLE IF NOT EXISTS userwatching (iduserWatching INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, watching TEXT, watcher TEXT)', [])
        .then(res => {
          for(var i=0; i<allUserWatching.length; i++){
                var watching = allUserWatching[i].watching;
                var watcher = allUserWatching[i].watcher;

                db.executeSql('INSERT INTO userwatching (watching, watcher) VALUES(?,?)', [watching, watcher]).then(res2 => {
                  
                })
                .catch(e => console.log("executing error insert userwatching-> ", JSON.stringify(e)));
          }
          
        })
        .catch(e => console.log("executing sql for create userwatching-> ", JSON.stringify(e)));
  }

  storeAllOneSignal(allOnesignal, db) {

       db.executeSql('CREATE TABLE IF NOT EXISTS onesignal_player (idonesignal INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user TEXT, player_id TEXT)', [])
        .then(res => {
          for(var i=0; i<allOnesignal.length; i++){
                var user = allOnesignal[i].user;
                var player_id = allOnesignal[i].player_id;

                db.executeSql('INSERT INTO onesignal_player (user, player_id) VALUES(?,?)', [user, player_id]).then(res2 => {
                  
                })
                .catch(e => console.log("executing error insert onesignal-> ", JSON.stringify(e)));
          }
          
        })
        .catch(e => console.log("executing sql for create onesignal-> ", JSON.stringify(e)));
  }


}
