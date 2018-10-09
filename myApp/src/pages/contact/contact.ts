import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { GroupDeatilPage } from '../groupDetail/groupDetail';
import { AddGroupPage } from '../addGroup/addGroup';
import { GroupService } from '../../providers/group.service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  @ViewChild('searchToFocusContact') searchToFocusContact;
  groups: any;
  groupsBackup: any;
  search: boolean = false;
  grpcount: number = 0;
  removeicon: boolean = false;
  allgroups: any;
  title: any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public groupService: GroupService, private alertCtrl: AlertController) {

  }

  presentConfirm(group) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'The tasks of the group will be moved to common group',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            let grp = {
              grpId : group.idgroup
            }
            this.groupService.deleteGroup(grp).then((res) => {
              if(res){
                this.removeicon = false;
                this.removeByKey(this.groups, {
                  key: 'idgroup',
                  value: group.idgroup
                })
              }
              
            })
          }
        }
      ]
    });
    alert.present();
  }

  removeByKey(array, params){
    array.some(function(item, index) {
      return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
    });
    return array;
  }

  // ionViewDidEnter() {
  //   this.initialize();
  // }

  ionViewWillEnter() {
    this.search = false;
    this.initialize();
  }

  deleteButton() {
    this.removeicon = !this.removeicon
  }

  deleteGroup(group) {
    this.presentConfirm(group);
  }


  showSearch() {
    this.search = !this.search;
    if(this.search == true){
      setTimeout(() => {
        this.searchToFocusContact.setFocus();
      }, 600)

    }
  }

  initialize() {
    this.grpcount = 0;
    this.groupService.allGroups().then((res) => {
      this.groups = res;
      this.groupsBackup = res;
      for (var i = 0; i < this.groups.length; i++) {
        this.grpcount = this.grpcount + 1;
        this.groups[i].color =
          '#' + Math.floor(Math.random() * 16777215).toString(16);
      }
    })
  }

  groupDetailView(group) {
    this.navCtrl.push(GroupDeatilPage, {
      page: "groupPage",
      selected_group: group
    });
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Sort By',
      buttons: [
        {
          text: 'Date',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        }, {
          text: 'Name',
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  addGroup() {
    this.navCtrl.push(AddGroupPage);
  }

  onInput(ev: any) {
    // Reset items back to all of the items
    this.groups = this.groupsBackup;
    this.allgroups = [];
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.groups = this.groups.filter((item) => {
        if(item.title.toLowerCase().indexOf(val.toLowerCase()) > -1){
          this.allgroups.push(item);
        }
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onCancel(ev: any) {
    const val = ev.target.value;
  }

  fillBox(conFil) {

    this.allgroups = null;
    this.title = conFil.title;
      this.groups = this.groups.filter((item) => {
        return (item.title.toLowerCase().indexOf(conFil.title.toLowerCase()) > -1);
      })


}

searchUser() {
  this.allgroups = [];
  this.groups.filter((item) => {
    //console.log('onInput - ' + JSON.stringify(item))
    if (item.title != undefined) {
      this.allgroups.push(item);
    }
  });

}

}
