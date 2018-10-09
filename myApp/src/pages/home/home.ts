import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavController, ActionSheetController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardPage } from '../dashboard/dashboard';
import { AddTasksPage } from '../addtasks/addTasks';
import { TaskService } from '../../providers/tasks.service';
import { UserService } from '../../providers/users.service';
import { OneSignal } from '@ionic-native/onesignal';
import { TasksByMePage } from '../tasksAssignedByMe/tasksByMe';
import { TasksToMePage } from '../tasksAssignedToMe/tasksToMe';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: '0' })),
      state('*', style({ opacity: '1' })),
      transition('void <=> *', animate('150ms ease-in'))
    ])
  ]
})
export class HomePage {
  allTasks: any;
  order: string = 'created_date'
  filter: any = {
    assigned_to: ''
  }
  sortName: String = 'Due Date'
  watchUsers: any;
  colors: any;
  loading: any;
  assigned_byme: number = 0;
  assigned_tome: number = 0;
  addForm: FormGroup;
  user: any;
  taskBackup: any;
  removeicon: boolean = false;
  allUsers: any;

  all: any = 'red';
  active: any;
  ontrack: any;
  delayed: any;
  done: any;
  more: any;
  showMessage: any;
  groups: any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public taskService: TaskService, public alertCtrl: AlertController, public userService: UserService, private oneSignal: OneSignal, public platform: Platform, public loadingCtrl: LoadingController) {
    this.addForm = new FormGroup({
      title: new FormControl('', Validators.required)
    });

    if (!(<any>window).cordova) {
      console.log('This is a native feature. Please use a device');
    } else {
      this.oneSignal.getIds().then((id) => {
        let data = {
          phone_number: window.localStorage.getItem('todos_phone_number'),
          player_id: id.userId
        }
        this.userService.addPlayerId(data).then((res) => {
        })
      });
    }

    this.userService.allUsers().then((res) => {
      this.allUsers = res;
    })

  }

  addNewTask() {
    if (this.addForm.value.title == null || this.addForm.value.title == "" || this.addForm.value.title == undefined) {
      this.showAlert("Required", "Title must be defined");
    } else {
      this.presentLoadingDefault();
      let data = {
        formValues: this.addForm.value,
        phone_number: this.user.phone_number,
        assigned_name:window.localStorage.getItem('todos_loginuser_name')
      }
      this.taskService.addSelfTask(data).then((response) => {
        this.addForm.patchValue({
          title: ''
        })
        this.initializeItems();
        this.loading.dismiss();
      })
    }
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

  initializeItems() {
    // this.presentLoadingDefault();
    this.user = {
      phone_number: window.localStorage.getItem("todos_phone_number")
    }
    this.groups = [];
    this.taskService.taskOfUser(this.user).then((res) => {
      this.taskBackup = res;
      this.allTasks = res;
      console.log(this.allTasks)
      this.assigned_byme = 0;
      this.assigned_tome = 0;
      if (this.allTasks.length == 0) {
        this.showMessage = true;
      } else {
        this.showMessage = false;
        for (var i = 0; i < this.allTasks.length; i++) {
          this.allTasks[i].color = '#4A4C4F';

          this.groups.push(this.allTasks[i].grpTitle) 
          // '#' + Math.floor(Math.random() * 16777215).toString(16);
          if (this.allTasks[i].assigned_by == window.localStorage.getItem("todos_phone_number")) {
            this.assigned_byme = this.assigned_byme + 1;
          }
          if (this.allTasks[i].assigned_to == window.localStorage.getItem("todos_phone_number")) {
            this.assigned_tome = this.assigned_tome + 1;
          }
        }
      }
      // this.loading.dismiss();
    })
    this.userService.assignedByMeUsers(this.user).then((res) => {
      this.watchUsers = res;
    })
  }

  ionViewWillEnter() {
    this.initializeItems();
  }

  // ionViewDidEnter() {
  //   this.initializeItems();
  // }

  dasboardView(task) {
    this.navCtrl.push(DashboardPage, {
      task: task,
      edit: true
    });
  }

  markComplete(task) {
    let taskData = {
      taskId: task.idtasks,
      taskstatus: "Completed"
    }
    task.status = "Completed";
    this.taskService.markAsComplete(taskData).then((res) => {
      if (res) {
        task.status = "Completed";
      } else {
        task.status = "Active";
      }
    })
  }

  markNotComplete(task) {
    let taskData = {
      taskId: task.idtasks,
      taskstatus: "Active"
    }
    task.status = "Active";
    this.taskService.markAsActive(taskData).then((res) => {
      if (res) {
        task.status = "Active";
      } else {
        task.status = "Completed";
      }
    })
  }

  assignedByMe() {
    this.navCtrl.push(TasksByMePage);
  }

  assignedToMe() {
    this.navCtrl.push(TasksToMePage);
  }

  showActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort By',
      buttons: [
        {
          text: 'Due Date',
          icon: 'clock',
          handler: () => {
            this.sortName = 'Due Date'
            this.filter = {
              assigned_to: ''
            }
            this.order = 'due_date'
          }
        },
        // {
        //   text: 'Group',
        //   icon: 'albums',
        //   handler: () => {
        //     this.sortName = 'Group Name'
        //     this.filter = {
        //       assigned_to: ''
        //     }
        //     this.order = 'groupId'
        //   }
        // },
        {
          text: 'Group',
          icon: 'albums',
          handler: () => {
            this.sortName = 'Group Name'
            let filterAlert = this.alertCtrl.create();
            filterAlert.setTitle('Select Group')
            var arr = this.removeDuplicates(this.groups, 'grpTitle');
            var newArr = [];
            for(var j=0; j< arr.length; j++){
              newArr.push(this.allTasks.find(o => o.grpTitle === arr[j]))
            }
            if (newArr.length != 0) {
              for (var k = 0; k < newArr.length; k++) {
                filterAlert.addInput({
                  type: 'radio',
                  label: newArr[k].grpTitle,
                  value: newArr[k].groupId
                })
              }
              filterAlert.addButton({
                text: 'Ok',
                handler: (data: any) => {
                  this.filter = {
                    groupId: data
                  }
                }
              })
            }else{
              filterAlert.setMessage("No groups found")
            }
            filterAlert.present();
          }
        },
        {
          text: 'Assigned to me',
          icon: 'contact',
          handler: () => {
            this.sortName = 'Assigned to self'
            this.filter = {
              assigned_to: window.localStorage.getItem('todos_phone_number')
            }
          }
        },
        {
          text: 'Assigned to others',
          icon: 'contacts',
          handler: () => {
            this.sortName = 'Assigned to others'
            let filterAlert = this.alertCtrl.create();
            filterAlert.setTitle('Select User')
            //this.unique = [...new Set(this.allTasks.map(item => item.Group))];
            for (var i = 0; i < this.watchUsers.length; i++) {
              filterAlert.addInput({
                type: 'radio',
                label: this.watchUsers[i].assigned_name + " - " + this.watchUsers[i].assigned_to,
                value: this.watchUsers[i].assigned_to
              })
            }
            filterAlert.addButton({
              text: 'Ok',
              handler: (data: any) => {
                this.filter = {
                  assigned_to: data
                }
              }
            })
            filterAlert.present();
          }

        }, {
          text: 'Remove Filter',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            this.sortName = ''
            this.filter = {
              assigned_to: ''
            }
            this.order = 'title'
          }
        }
      ]
    })
    actionSheet.present();
  }

  // removeDuplicates(arr, prop) {
  //   let obj = {};
  //   return Object.keys(arr.reduce((prev, next) => {
  //     if (!obj[next[prop]]) obj[next[prop]] = next;
  //     return obj;
  //   }, obj)).map((i) => obj[i]);
  // }

  removeDuplicates(arr, prop) {
    return arr.filter(function(item, pos) {
      return arr.indexOf(item) == pos;
  })
  }

  addTask() {
    this.navCtrl.push(AddTasksPage);
  }

  qFilterTasks(val) {

    if (val == "all") {
      this.allTasks = this.taskBackup;
      this.all = 'red';
      this.active = '#3C87F6';
      this.ontrack = '#3C87F6';
      this.delayed = '#3C87F6';
      this.done = '#3C87F6';
      this.more = '#3C87F6';
      if (this.allTasks.length == 0) {
        this.showMessage = true;
      }else{
        this.showMessage = false;
      }
    } else if (val == "active") {
      this.all = '#3C87F6';
      this.active = 'red';
      this.ontrack = '#3C87F6';
      this.delayed = '#3C87F6';
      this.done = '#3C87F6';
      this.more = '#3C87F6';
      this.allTasks = this.taskBackup;
      var active = [];
      for (var i = 0; i < this.allTasks.length; i++) {
        if (this.allTasks[i].status == "Active" || this.allTasks[i].status == "On Track") {
          active.push(this.allTasks[i])
        }
      }
      this.allTasks = active;
      if (this.allTasks.length == 0) {
        this.showMessage = true;
      }else {
        this.showMessage = false;
      }
    }
    //else if (val == "onTrack") {
    //   this.all = '#3C87F6';
    //   this.active = '#3C87F6';
    //   this.ontrack = 'red';
    //   this.delayed = '#3C87F6';
    //   this.done = '#3C87F6';
    //   this.more = '#3C87F6';
    //   this.allTasks = this.taskBackup;
    //   var onTrack = [];
    //   for (var i = 0; i < this.allTasks.length; i++) {
    //     if (this.allTasks[i].status == "On Track") {
    //       onTrack.push(this.allTasks[i])
    //     }
    //   }
    //   this.allTasks = onTrack;

    // } 
    else if (val == "delayed") {
      this.all = '#3C87F6';
      this.active = '#3C87F6';
      this.ontrack = '#3C87F6';
      this.delayed = 'red';
      this.done = '#3C87F6';
      this.more = '#3C87F6';
      this.allTasks = this.taskBackup;
      var delayed = [];
      for (var i = 0; i < this.allTasks.length; i++) {
        if (this.allTasks[i].status == "Delayed") {
          delayed.push(this.allTasks[i])
        }
      }
      this.allTasks = delayed;
      if (this.allTasks.length == 0) {
        this.showMessage = true;
      }else {
        this.showMessage = false;
      }

    } else if (val == "completed") {
      this.all = '#3C87F6';
      this.active = '#3C87F6';
      this.ontrack = '#3C87F6';
      this.delayed = '#3C87F6';
      this.done = 'red';
      this.more = '#3C87F6';
      this.allTasks = this.taskBackup;
      var completed = [];
      for (var i = 0; i < this.allTasks.length; i++) {
        if (this.allTasks[i].status == "Completed") {
          completed.push(this.allTasks[i])
        }
      }
      this.allTasks = completed;
      if (this.allTasks.length == 0) {
        this.showMessage = true;
      }else {
        this.showMessage = false;
      }

    } else if (val == "due") {
      this.all = '#3C87F6';
      this.active = '#3C87F6';
      this.ontrack = '#3C87F6';
      this.delayed = '#3C87F6';
      this.done = '#3C87F6';
      this.more = 'red';
      this.showRadio()
    }
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Due Date');

    alert.addInput({
      type: 'radio',
      label: 'Past',
      value: 'past',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Today',
      value: 'today',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Upcoming',
      value: 'upcoming',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data == "past") {
          this.allTasks = this.taskBackup;
          var formattedDays = [];
          var date = moment().format();
          var today = new Date(date);
          today.setHours(0, 0, 0, 0);
          for (var z = 0; z < this.allTasks.length; z++) {
            var due = moment(moment(this.allTasks[z].due_date).format(), moment.ISO_8601).format();
            var formatted_due = new Date(due);
            formatted_due.setHours(0, 0, 0, 0);
            if (today > formatted_due) {
              formattedDays.push(this.allTasks[z]);
            }
          }
          this.allTasks = formattedDays;
          if (this.allTasks.length == 0) {
            this.showMessage = true;
          }else {
            this.showMessage = false;
          }
        }
        else if (data == "today") {
          this.allTasks = this.taskBackup;
          var formattedDays = [];
          var date = moment().format();
          var today = new Date(date);
          today.setHours(0, 0, 0, 0);
          for (var z = 0; z < this.allTasks.length; z++) {
            var due = moment(moment(this.allTasks[z].due_date).format(), moment.ISO_8601).format();
            var formatted_due = new Date(due);
            formatted_due.setHours(0, 0, 0, 0);
            if (today == formatted_due) {
              formattedDays.push(this.allTasks[z]);
            }
          }
          this.allTasks = formattedDays;
          if (this.allTasks.length == 0) {
            this.showMessage = true;
          }else {
            this.showMessage = false;
          }
        }
        else if (data == "upcoming") {
          this.allTasks = this.taskBackup;
          var formattedDays = [];
          var date = moment().format();
          var today = new Date(date);
          today.setHours(0, 0, 0, 0);
          for (var z = 0; z < this.allTasks.length; z++) {
            var due = moment(moment(this.allTasks[z].due_date).format(), moment.ISO_8601).format();
            var formatted_due = new Date(due);
            formatted_due.setHours(0, 0, 0, 0);
            console.log(formatted_due)
            if (today < formatted_due) {
              formattedDays.push(this.allTasks[z]);
            }
          }
          this.allTasks = formattedDays;
          if (this.allTasks.length == 0) {
            this.showMessage = true;
          }else {
            this.showMessage = false;
          }
        }
      }
    });
    alert.present();
  }

  deleteButton() {
    this.removeicon = !this.removeicon
  }

  deleteTask(task) {
    if ((task.assigned_to == this.user.phone_number && task.assigned_by == this.user.phone_number) || (task.assigned_by == this.user.phone_number && task.assigned_to != this.user.phone_number)) {
      this.presentLoadingDefault();
      this.taskService.deleteTask(task).then((res) => {
        if (res) {
          this.removeicon = false;
          this.initializeItems();
        }
        setTimeout(() => {
          this.loading.dismiss();
        }, 1800);
      })
    } else if (task.assigned_by != this.user.phone_number && task.assigned_to == this.user.phone_number) {
      this.showRadioOfUsers(task);
    }
  }

  showRadioOfUsers(task) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Chnage assigned user');
    for (var x = 0; x < this.allUsers.length; x++) {
      if (this.allUsers[x].phone_number != this.user.phone_number) {
        alert.addInput({
          type: 'radio',
          label: this.allUsers[x].firstname,
          value: this.allUsers[x].phone_number,
          checked: false
        });
      }
    }
    alert.addButton({
      text: 'Cancel',
      handler: data => {
        this.removeicon = false;
      }
    });
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.removeicon = false;
        if (data != undefined) {
          let task_data = {
            task: task,
            user: data
          }
          this.presentLoadingDefault();
          this.taskService.delete_AssignTask(task_data).then((res) => {
            console.log(res);
            if (res) {
              this.removeicon = false;
              this.initializeItems();
            }
            setTimeout(() => {
              this.loading.dismiss();
            }, 1800);
          })
        }
      }
    });
    alert.present();
  }



}
