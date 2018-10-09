import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';
import { AlertController } from 'ionic-angular';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { TaskService } from '../../providers/tasks.service';
import * as moment from 'moment';
import { GroupService } from '../../providers/group.service';
import { UserService } from '../../providers/users.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [Contacts]
})
export class DashboardPage {
  task: any;
  myform: FormGroup;
  user: any;
  status = ["On Track", "Active", "Delayed", "Completed"];
  groupList: any;
  contactList: { name: any, phone: any }[] = [];
  contactListFiltered: any;
  updateMode: boolean = true;
  editicon: boolean = false;
  loading: any;
  allUsers: any;
  assigned_to_phone : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskService: TaskService, private datePicker: DatePicker, public groupService: GroupService, private contacts: Contacts, private datePipe: DatePipe, public viewCtrl: ViewController, private alertCtrl: AlertController, public userService: UserService, public loadingCtrl: LoadingController) {
    this.task = this.navParams.get('task');
    this.editicon = this.navParams.get('edit');

    var self = false;
    if (this.task.assigned_to == this.task.assigned_by) {
      self = true;
    }

    this.myform = new FormGroup({
      title: new FormControl(this.task.title, Validators.required),
      description: new FormControl(this.task.description, Validators.required),
      group: new FormControl(this.task.groupId, Validators.required),
      assigned_to: new FormControl(this.task.assigned_name, Validators.required),
      status: new FormControl(this.task.status, Validators.required),
      date: new FormControl(),
      self: new FormControl(self)
    });
  }


  datepicker() {
    this.myform.patchValue({
      date: moment(moment().format(), moment.ISO_8601).format()
    })
  }

  searchUser(){
    this.contactListFiltered = [];
    this.contactList.filter((item) => {
      console.log(JSON.stringify(item))
      //console.log('onInput - ' + JSON.stringify(item))
      if (item.name != undefined) {
          this.contactListFiltered.push(item);
      }
    });
  }

  showAlert(title, subtitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  ionViewDidLoad() {
    let task = {
      taskId: this.task.idtasks
    }
    this.presentLoadingDefault();
    this.taskService.getOneTaskDetails(task).then((res) => {
      this.task = res[0];
      this.assigned_to_phone = this.task.assigned_to;
      if(this.task.firstname == null){
        this.task.firstname = this.task.assigned_to
      }
      if (this.task != undefined) {
        var dateCheck = moment(this.task.due_date);
        if (dateCheck.isValid()) {
          this.myform.patchValue({
            date: moment(moment(this.task.due_date).format(), moment.ISO_8601).format()
          })
        } else {
          this.myform.patchValue({
            date: moment(moment().format(), moment.ISO_8601).format()
          })
        }
      }
      this.loading.dismiss();
    })

    this.groupService.allGroups().then(((response) => {
      this.groupList = response;
    }))

    if (!(<any>window).cordova) {
      this.userService.allUsers().then((res) => {
        this.allUsers = res;
        for (var i = 0; i < this.allUsers.length; i++) {
          // console.log("contact_data - "+JSON.stringify(data[i]))
          this.contactList.push({
            name: this.allUsers[i].firstname,
            phone: this.allUsers[i].phone_number
          })
        }
      }, err => {
        console.log("contact " + err);
      });

    } else {
      if(document.URL.startsWith('http://54.149.85.163/ToDo/') || document.URL.startsWith('http://localhost/ToDo/')){
        this.userService.allUsers().then((res) => {
          this.allUsers = res;
          for (var i = 0; i < this.allUsers.length; i++) {
            // console.log("contact_data - "+JSON.stringify(data[i]))
            this.contactList.push({
              name: this.allUsers[i].firstname,
              phone: this.allUsers[i].phone_number
            })
          }
        }, err => {
          console.log("contact " + err);
        });
      }
      else{
        this.contacts.find(['displayName', 'phoneNumbers'], { filter: "", multiple: true, hasPhoneNumber: true })
        .then((data) => {

            for (var i = 0; i < data.length; i++) {
              this.contactList.push({
  
                name: data[i]['_objectInstance'].name.givenName,
                phone: data[i]['_objectInstance'].phoneNumbers
              })
            }

        }, err => {
          console.log("contact " + err);
        });
      }
    }

    this.user = window.localStorage.getItem("todos_phone_number");
  }

  disscussView() {
    this.navCtrl.push(MessagePage);
  }

  updateModel() {
    this.updateMode = !this.updateMode;
  }

  updateTask() {
    if (this.myform.value.title == null || this.myform.value.title == "" || this.myform.value.title == undefined) {
      this.showAlert("Required", "Title must be defined");
    } else {
      this.presentLoadingDefault();
    if (this.myform.value.self) {
      this.assigned_to_phone = window.localStorage.getItem('todos_phone_number');
      this.myform.value.assigned_to = window.localStorage.getItem('todos_phone_number')
    }else if(this.myform.value.assigned_to == "" || this.myform.value.assigned_to == null || this.myform.value.assigned_to == undefined){
      this.assigned_to_phone = window.localStorage.getItem('todos_phone_number');
      this.myform.value.assigned_to = window.localStorage.getItem('todos_phone_number')
      this.showAlert("No user selected", "The task assgined to self");
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
      // this.myform.value.assigned_to = assigned_to;
    }
    let data = {
      formValues: this.myform.value,
      task_id: this.task.idtasks,
      phone_number: this.task.assigned_by,
      assigned_to : this.assigned_to_phone
    }
    this.taskService.updatetask(data).then((response) => {
      this.viewCtrl.dismiss();
      this.loading.dismiss();
      if (response) {
        if (this.myform.value.assigned_to == window.localStorage.getItem('todos_phone_number')) {

        } else {
          this.sendNotification(this.myform.value.assigned_to, 'A new task has been added')

        }
      } else {
        var smsData = {
          phoneNumber: this.myform.value.assigned_to,
          message: 'A task has been assigned to you on Todos. Download the Todos app to see your tasks. https://speedx-senuraa.c9users.io/todos.apk'
        }
        this.taskService.sendTaskSMS(smsData).then((res) => {
          // this.viewCtrl.dismiss();
        })

      }
    })
  }
  }

  onInput(searchTerm: any) {
    this.contactListFiltered = [];
    if (searchTerm.target.value && searchTerm.target.value.trim() !== '' && this.contactList.length != 0) {
      this.contactList.filter((item) => {
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

  dismiss() {
    this.viewCtrl.dismiss();
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

  sendNotification(phone_number, msg) {
    var resp;
    var player_ids = [];
    var userData = {
      phone_number: phone_number
    }
    this.userService.getPlayerId(userData).then((response) => {
      resp = response;
      for (var i = 0; i < resp.length; i++) {
        player_ids.push(resp[i].player_id);
      }
      var notificationObj: any = {
        "app_id": "eafd1be8-cb7a-4ae0-aa0a-6fce30754e10",
        "contents": { "en": msg },
        "include_player_ids": player_ids
      }

      this.taskService.sendNotification(notificationObj).then((res) => {
        console.log(res);
      })
    })
  }

}
