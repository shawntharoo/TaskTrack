import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { GroupService } from '../../providers/group.service';
import { TaskService } from '../../providers/tasks.service';

@Component({
  selector: 'page-groupDetail',
  templateUrl: 'groupDetail.html'
})
export class GroupDeatilPage {
  task: String = "active";
  data: any;
  tasks: any;
  onTrack: any = [];
  active: any = [];
  delayed: any = [];
  completed : any = [];
  order: string = 'created_date'
  filter: any = {
    assigned_by: ''
  }
  assigned_byothers: any = [];
  pageT : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public grpService: GroupService, public taskService: TaskService, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public platform: Platform) {

  }

  ionViewWillEnter(){
    if (this.navParams.get('page') == "userPage") {
      this.pageT = "userPage";
      console.log("user page");
      this.data = this.navParams.get('selected_user');
      let para = {
        assigned_user: this.data.phone_number
      }
      var user = window.localStorage.getItem("todos_phone_number");
      this.taskService.taskAssignedToUser(para).then((res) => {
        this.active = [];
        this.delayed = [];
        this.onTrack = [];
        this.completed = [];
        this.tasks = res;
        for (var i = 0; i < this.tasks.length; i++) {
          if (user != this.tasks[i].assigned_by) {
            this.assigned_byothers.push(this.tasks[i].assigned_by);
          }
          if (this.tasks[i].status == "Active" || this.tasks[i].status == "On Track") {
            this.active.push(this.tasks[i]);
          } else if (this.tasks[i].status == "Delayed") {
            this.delayed.push(this.tasks[i]);
          } else if (this.tasks[i].status == "Completed") {
            this.completed.push(this.tasks[i]);
          }
          // else {
          //   this.onTrack.push(this.tasks[i]);
          // }
        }
      })
    } else if (this.navParams.get('page') == "groupPage") {
      console.log("group page");
      this.pageT = "groupPage";
      this.data = this.navParams.get('selected_group');
      let para = {
        groupId: this.data.idgroup
      }
      this.grpService.taskOfGroup(para).then((res) => {
        this.active = [];
        this.delayed = [];
        this.onTrack = [];
        this.tasks = res;
        for (var i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].status == "Active" || this.tasks[i].status == "On Track") {
            this.active.push(this.tasks[i]);
          } else if (this.tasks[i].status == "Delayed") {
            this.delayed.push(this.tasks[i]);
          } else if (this.tasks[i].status == "Completed") {
            this.completed.push(this.tasks[i]);
          }
        }
      })
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort By',
      buttons: [
        {
          text: 'Due Date',
          icon: 'clock',
          handler: () => {
            this.filter = {
              assigned_by: ''
            }
            this.order = 'due_date'
          }
        },
        // {
        //   text: 'Group',
        //   icon: 'briefcase',
        //   handler: () => {
        //     this.filter = {
        //       assigned_by: ''
        //     }
        //     this.order = 'groupId'
        //   }
        // },
        {
          text: 'Assigned by me',
          icon: 'contact',
          handler: () => {
            this.filter = {
              assigned_by: window.localStorage.getItem('todos_phone_number')
            }
          }
        },
        {
          text: 'Assigned by others',
          icon: 'contacts',
          handler: () => {
            let filterAlert = this.alertCtrl.create();
            filterAlert.setTitle('Select User')
            var arr = this.removeDuplicates(this.assigned_byothers, 'assigned_by');
            var newArr = [];
            for(var i=0; i< arr.length; i++){
              newArr.push(this.tasks.find(o => o.assigned_by === arr[i]))
            }

            if (newArr.length != 0) {
              for (var i = 0; i < newArr.length; i++) {
                filterAlert.addInput({
                  type: 'radio',
                  label: newArr[i].firstname,
                  value: newArr[i].assigned_by
                })
              }
              filterAlert.addButton({
                text: 'Ok',
                handler: (data: any) => {
                  this.filter = {
                    assigned_by: data
                  }
                }
              })
            } else {
              filterAlert.setMessage("No users found")
            }

            filterAlert.present();
          }

        },
         {
          text: 'Remove Filter',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
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

  viewDashboard(task) {
    this.navCtrl.push(DashboardPage, {
      task: task,
      edit: false
    });
  }

}
