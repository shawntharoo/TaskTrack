import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { AlertController } from 'ionic-angular';
import { TaskService } from '../../providers/tasks.service';
import * as moment from 'moment';
import { GroupService } from '../../providers/group.service';
import { UserService } from '../../providers/users.service';
import { OneSignal } from '@ionic-native/onesignal';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'page-addTasks',
  templateUrl: 'addTasks.html',
  providers: [Contacts]
})
export class AddTasksPage {
  @ViewChild('inputToFocus') inputToFocus;
  myform: FormGroup;
  user: any;
  status = ["On Track", "Active", "Delayed", "Completed"];
  groupList: any;
  contactList: { name: any, phone: any, index: any }[] = [];
  contactListFiltered: any;
  tempUsers: any;
  agree: boolean;
  loading: any;
  allUsers: any;
  assigned_to_phone: any;

  constructor(public navCtrl: NavController, public taskService: TaskService, private datePicker: DatePicker, public viewCtrl: ViewController, private datePipe: DatePipe, private contacts: Contacts, private alertCtrl: AlertController, public groupService: GroupService, public userService: UserService, private oneSignal: OneSignal, public http: HttpClient, public loadingCtrl: LoadingController) {
    this.myform = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      group: new FormControl('1', Validators.required),
      assigned_to: new FormControl('', Validators.required),
      status: new FormControl('On Track', Validators.required),
      date: new FormControl(),
      self: new FormControl(false)
    });
  }

  datepicker() {
    this.myform.patchValue({
      date: moment(moment().format(), moment.ISO_8601).format()
    })
    console.log(this.myform.value.date)
  }

  searchUser() {
    this.contactListFiltered = [];
    this.contactList.filter((item) => {
      //console.log('onInput - ' + JSON.stringify(item))
      if (item.name != undefined) {
        this.contactListFiltered.push(item);
      }
    });
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }

  ionViewDidLeave() {
    setTimeout(() => {
      this.inputToFocus.setBlur()
    }, 600)
  }

  ionViewDidLoad() {

    this.myform.patchValue({
      date: moment(moment().format(), moment.ISO_8601).format()
    })

    this.groupService.allGroups().then((res) => {
      this.groupList = res;
    })

    if (!(<any>window).cordova) {
      this.userService.allUsers().then((res) => {
        this.allUsers = res;
        for (var i = 0; i < this.allUsers.length; i++) {
          // console.log("contact_data - "+JSON.stringify(data[i]))
          this.contactList.push({
            name: this.allUsers[i].firstname,
            phone: this.allUsers[i].phone_number,
            index: i
          })
        }
      }, err => {
        console.log("contact " + err);
      });

    } else {
      if (document.URL.startsWith('http://54.149.85.163/ToDo/')|| document.URL.startsWith('http://localhost/ToDo/')) {
        this.userService.allUsers().then((res) => {
          this.allUsers = res;
          for (var i = 0; i < this.allUsers.length; i++) {
            // console.log("contact_data - "+JSON.stringify(data[i]))
            this.contactList.push({
              name: this.allUsers[i].firstname,
              phone: this.allUsers[i].phone_number,
              index: i
            })
          }
        }, err => {
          console.log("contact " + err);
        });
      }
      else {
        this.contacts.find(['displayName', 'phoneNumbers'], { filter: "", multiple: true, hasPhoneNumber: true })
          .then((data) => {
            for (var i = 0; i < data.length; i++) {
              this.contactList.push({

                name: data[i]['_objectInstance'].name.givenName,
                phone: data[i]['_objectInstance'].phoneNumbers,
                index: i
              })
            }

          }, err => {
            console.log("contact " + err);
          });
      }
    }

    //this.myform.value.date =  moment(moment().format(), moment.ISO_8601).format();


    this.user = window.localStorage.getItem("todos_phone_number");

    setTimeout(() => {
      this.inputToFocus.setFocus();
    }, 600)
  }

  addNewTask() {
    if (this.myform.value.title == null || this.myform.value.title == "" || this.myform.value.title == undefined) {
      this.showAlert("Required", "Title must be defined");
    } else {
      this.presentLoadingDefault();
      if (this.myform.value.self) {
        this.assigned_to_phone = window.localStorage.getItem('todos_phone_number');
        this.myform.value.assigned_to = window.localStorage.getItem('todos_loginuser_name')
      } else if (this.myform.value.assigned_to == "" || this.myform.value.assigned_to == null || this.myform.value.assigned_to == undefined) {
        this.assigned_to_phone = window.localStorage.getItem('todos_phone_number');
        this.myform.value.assigned_to = window.localStorage.getItem('todos_loginuser_name')
        this.showAlert("No user selected", "Task assgined to self");
      } else {
        var assigned_to = this.assigned_to_phone.replace(/ /g, '').replace(/-/g, '').replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "")
        if (assigned_to.charAt(0) != '0' && assigned_to.length == 9) {
          this.assigned_to_phone = '94' + '' + assigned_to
        }
        else if (assigned_to.charAt(0) == '0') {
          this.assigned_to_phone = '94' + '' + assigned_to.replace('0', '')
        }
        else if (assigned_to.charAt(0) == '9' && assigned_to.charAt(1) == '4' && assigned_to.length == 11) {
          this.assigned_to_phone = assigned_to;
        }
        else if (assigned_to.charAt(0) == '9' && assigned_to.charAt(1) == '4' && assigned_to.charAt(2) == '0' && assigned_to.length == 12) {
          this.assigned_to_phone = assigned_to.replace('0', '')
        }
      }

      let data = {
        formValues: this.myform.value,
        phone_number: this.user,
        assigned_to : this.assigned_to_phone
      }
      var userFrom;
      this.taskService.addtask(data).then((response) => {
        this.loading.dismiss();
        userFrom = response;
        this.viewCtrl.dismiss();
        if (userFrom.length != 0) {
          if (this.myform.value.assigned_to == window.localStorage.getItem('todos_phone_number')) {
            // this.viewCtrl.dismiss();
          } else {
            this.sendNotification(this.myform.value.assigned_to, 'A new task has been added')
            // this.viewCtrl.dismiss();
          }
        } else {
          var smsData = {
            phoneNumber: this.myform.value.assigned_to,
            message: 'A task has been assigned to you on Todos. Download the Todos app to see your tasks.'
          }
          this.taskService.sendTaskSMS(smsData).then((res) => {
            // this.viewCtrl.dismiss();
          })
          // this.viewCtrl.dismiss();
        }
      })
    }
  }

  onInput(searchTerm: any) {
    this.contactListFiltered = [];
    //console.log('onInput - '+JSON.stringify(this.contactList))

    //console.log('searchTerm - '+JSON.stringify(searchTerm,['message','arguments','type','name']))
    //console.log('Searchterm val = ' + searchTerm.target.value)
    if (searchTerm.target.value && searchTerm.target.value.trim() !== '' && this.contactList.length != 0) {
      this.contactList.filter((item) => {
        //console.log('onInput - ' + JSON.stringify(item))
        if (item.name != undefined) {

          if (item.name.toLowerCase().includes(searchTerm.target.value.toLowerCase())) {
            this.contactListFiltered.push(item);
          }
        }
      });
    }
  }

  fillBox(conFil) {
    if (!(<any>window).cordova) {
      this.myform.controls["assigned_to"].setValue(conFil.name);
      this.assigned_to_phone = conFil.phone.replace(/[^0-9]/ig, '');
      // this.myform.controls["assigned_to"].setValue(conFil.phone.replace(/[^0-9]/ig, ''))
      this.contactListFiltered = null;
    } else {
      if (document.URL.startsWith('http://54.149.85.163/ToDo/') || document.URL.startsWith('http://localhost/ToDo/')) {
          this.myform.controls["assigned_to"].setValue(conFil.name);
          this.assigned_to_phone = conFil.phone.replace(/[^0-9]/ig, '');
      } else {
        if (conFil.phone.length > 1) {
          this.showRadioAlert(conFil);
        } else if (conFil.phone.length == 1) {
          this.myform.controls["assigned_to"].setValue(conFil.name);
          this.assigned_to_phone = conFil.phone[0].value.replace(/[^0-9]/ig, '');
          // this.myform.controls["assigned_to"].setValue(conFil.phone[0].value.replace(/[^0-9]/ig, ''))
        } else {
          console.log("no contacts ")
        }
      }
      this.contactListFiltered = null;
    }

  }


  showRadioAlert(phoneNumbers) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Phone Number');
    for (var i = 0; i < phoneNumbers.phone.length; i++) {
      alert.addInput({
        type: 'radio',
        label: phoneNumbers.phone[i].value,
        value: phoneNumbers.phone[i].value,
        checked: false
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.myform.controls["assigned_to"].setValue(phoneNumbers.name);
        this.assigned_to_phone = data.replace(/[^0-9]/ig, '');
      }
    });
    alert.present();
  }


  showAlert(title, subtitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  sendNotification(phone_number, msg) {
    var resp;
    var player_ids = [];
    var userData = {
      phone_number: phone_number
    }
    this.userService.getPlayerId(userData).then((response) => {
      console.log("player id list -> " + JSON.stringify(response))
      resp = response;
      for (var i = 0; i < resp.length; i++) {
        player_ids.push(resp[i].player_id);
      }
      var notificationObj: any = {
        "app_id": "eafd1be8-cb7a-4ae0-aa0a-6fce30754e10",
        "contents": { "en": msg },
        "include_player_ids": player_ids
      }

      console.log(JSON.stringify(notificationObj));

      this.taskService.sendNotification(notificationObj).then((res) => {
        console.log(res);
      })

      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'Content-Type':  'application/json'
      //   })
      // }
      // this.http.post('https://onesignal.com/api/v1/notifications', notificationObj, httpOptions).subscribe(data => {
      //   console.log(JSON.stringify(data));
      // } , error => {
      //   console.log(JSON.stringify(error));
      // });

      // window["plugins"].OneSignal.postNotification(notificationObj,
      //   function (successResponse) {
      //     console.log("Notification Post Success:", successResponse);
      //   },
      //   function (failedResponse) {
      //     console.log("Notification Post Failed: ", JSON.stringify(failedResponse));
      //   });
    })
  }

}

