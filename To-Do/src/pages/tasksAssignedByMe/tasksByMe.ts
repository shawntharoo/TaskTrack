import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavController, ActionSheetController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { AddTasksPage } from '../addtasks/addTasks';
import { TaskService } from '../../providers/tasks.service';
import { UserService } from '../../providers/users.service';
import { OneSignal } from '@ionic-native/onesignal';
import * as moment from 'moment';

@Component({
  selector: 'page-tasksByMe',
  templateUrl: 'tasksByMe.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: '0' })),
      state('*', style({ opacity: '1' })),
      transition('void <=> *', animate('150ms ease-in'))
    ])
  ]
})
export class TasksByMePage {
  allTasks: any;
  order: string = 'title'
  filter: any = {
    assigned_to: ''
  }
  sortName: String = 'Due Date'
  watchUsers: any;
  colors: any;
  loading: any;
  taskBackup : any;
  assignedToOthers : any;
  removeicon: boolean = false;
  allUsers: any;
  user: any;

  all:any = 'red';
  active:any;
  ontrack:any;
  delayed:any;
  done:any;
  more:any;
  showMessage: any;
  groups: any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public taskService: TaskService, public alertCtrl: AlertController, public userService: UserService, private oneSignal: OneSignal, public platform: Platform, public loadingCtrl: LoadingController) {

  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  markComplete(task) {
    let taskData = {
      taskId : task.idtasks,
      taskstatus : "Completed"
    }
    task.status = "Completed";
    this.taskService.markAsComplete(taskData).then((res) => {
      if(res){
        task.status = "Completed";
      }
    })
  }

  markNotComplete(task) {
    let taskData = {
      taskId : task.idtasks,
      taskstatus : "Active"
    }
    task.status = "Active";
    this.taskService.markAsActive(taskData).then((res) => {
      if(res){
        task.status = "Active";
      }
    })
  }

  initializeItems() {
    // this.presentLoadingDefault();
    this.user = {
      assigned_user: window.localStorage.getItem("todos_phone_number")
    }
    this.groups = [];
    this.taskService.taskAssignedByUser(this.user).then((res) => {
      this.allTasks = res;
      this.taskBackup = res;
      this.assignedToOthers = [];
      if (this.allTasks.length == 0) {
        this.showMessage = true;
      } else {
        this.showMessage = false;
      for(var i=0; i<this.allTasks.length; i++){
        this.groups.push(this.allTasks[i].grpTitle) 
        this.allTasks[i].color ='#4A4C4F';
          if(this.allTasks[i].assigned_to == window.localStorage.getItem("todos_phone_number")){
          }else{
            this.assignedToOthers.push(this.allTasks[i].assigned_to)
          }
      }
    }
      // this.loading.dismiss();
    })
  }

  // ionViewWillEnter() {
  //   this.initializeItems();
  // }

  ionViewDidEnter() {
    this.initializeItems();
    this.userService.allUsers().then((res) => {
      this.allUsers = res;
    })
  }

  dasboardView(task) {
    this.navCtrl.push(DashboardPage, {
      task: task,
      edit: true
    });
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
            
            var arr = this.removeDuplicates(this.assignedToOthers, 'assigned_to');
            var newArr = [];
            for(var i=0; i< arr.length; i++){
              newArr.push(this.allTasks.find(o => o.assigned_to === arr[i]))
            }

            if (newArr.length != 0) {
            for (var i = 0; i < newArr.length; i++) {
              filterAlert.addInput({
                type: 'radio',
                label: newArr[i].firstname,
                value: newArr[i].assigned_to
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
          }else{
            filterAlert.setMessage("No users found")
          }
            filterAlert.present();
          }

        },{
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

  removeDuplicates(arr, prop) {
    return arr.filter(function(item, pos) {
      return arr.indexOf(item) == pos;
  })
    // let obj = {};
    // return Object.keys(arr.reduce((prev, next) => {
    //   if (!obj[next[prop]]) obj[next[prop]] = next;
    //   return obj;
    // }, obj)).map((i) => obj[i]);
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
      }else {
        this.showMessage = false;
      }
    } 
    else if (val == "active") {
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
    // else if (val == "onTrack") {
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
      }else{
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
      }else{
        this.showMessage = false;
      }

    }else if (val == "due") {
      this.all = '#3C87F6';
      this.active = '#3C87F6';
      this.ontrack = '#3C87F6';
      this.delayed = '#3C87F6';
      this.done = '#3C87F6';
      this.more = 'red';
      this.showRadio()
    }
  }


  deleteButton() {
    this.removeicon = !this.removeicon
  }

  deleteTask(task) {
    if ((task.assigned_to == this.user.assigned_user && task.assigned_by == this.user.assigned_user) || (task.assigned_by == this.user.assigned_user && task.assigned_to != this.user.assigned_user)) {
      this.presentLoadingDefault()
      this.taskService.deleteTask(task).then((res) => {
        if (res) {
          this.removeicon = false;
          this.initializeItems();
        }      
        setTimeout(() => {
          this.loading.dismiss();
        }, 1800);
      })
    } else if (task.assigned_by != this.user.assigned_user && task.assigned_to == this.user.assigned_user) {
      this.showRadioOfUsers(task);
    }
  }

  showRadioOfUsers(task) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Chnage assigned user');
    for (var x = 0; x < this.allUsers.length; x++) {
      if (this.allUsers[x].phone_number != this.user.assigned_user) {
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
        if(data != undefined){
          let task_data = {
            task : task,
            user : data
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
        if(data == "past"){
          this.allTasks = this.taskBackup;
          var formattedDays = [];
          var date = moment().format();
          var today = new Date(date);
          today.setHours(0,0,0,0);
          for(var z= 0; z< this.allTasks.length; z++){
            var due = moment(moment(this.allTasks[z].due_date).format(), moment.ISO_8601).format();
            var formatted_due = new Date(due);
            formatted_due.setHours(0,0,0,0);
            if(today > formatted_due){
              formattedDays.push(this.allTasks[z]);
            } 
          }
          this.allTasks = formattedDays;
          if (this.allTasks.length == 0) {
            this.showMessage = true;
          }else{
            this.showMessage = false;
          }
        }
        else if(data == "today"){
          this.allTasks = this.taskBackup;
          var formattedDays = [];
          var date = moment().format();
          var today = new Date(date);
          today.setHours(0,0,0,0);
          for(var z= 0; z< this.allTasks.length; z++){
            var due = moment(moment(this.allTasks[z].due_date).format(), moment.ISO_8601).format();
            var formatted_due = new Date(due);
            formatted_due.setHours(0,0,0,0);
            if(today == formatted_due){
              formattedDays.push(this.allTasks[z]);
            } 
          }
          this.allTasks = formattedDays;
          if (this.allTasks.length == 0) {
            this.showMessage = true;
          }else{
            this.showMessage = false;
          }
        }
        else if(data == "upcoming"){
          this.allTasks = this.taskBackup;
          var formattedDays = [];
          var date = moment().format();
          var today = new Date(date);
          today.setHours(0,0,0,0);
          for(var z= 0; z< this.allTasks.length; z++){
            var due = moment(moment(this.allTasks[z].due_date).format(), moment.ISO_8601).format();
            var formatted_due = new Date(due);
            formatted_due.setHours(0,0,0,0);
            console.log(today, formatted_due)
            if(today < formatted_due){
              formattedDays.push(this.allTasks[z]);
            } 
          }
          this.allTasks = formattedDays;
          if (this.allTasks.length == 0) {
            this.showMessage = true;
          }else{
            this.showMessage = false;
          }
        }
      }
    });
    alert.present();
  }

}
