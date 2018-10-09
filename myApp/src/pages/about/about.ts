import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { GroupDeatilPage } from '../groupDetail/groupDetail';
import { UserService } from '../../providers/users.service';
import { AddUserPage } from '../addUser/addUser';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('searchToFocusAbout') searchToFocusAbout;

  watchUsers: any;
  watchUserBackup: any;
  otherUsers: any;
  otherUserBackup: any;
  user: any;
  search: boolean = false;
  removeicon: boolean = false;
  addicon: boolean = false;
  loading: any;
  watchcount: number = 0;
  othercount: number = 0;
  allsearchUsers: any;
  name: any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public userService: UserService, public loadingCtrl: LoadingController) {

  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }

  // ionViewDidLoad() {
  //   this.user = {
  //     phone_number: window.localStorage.getItem("todos_phone_number")
  //   }
  //   this.initializeItems(this.user);
  // }

  ionViewWillEnter() {
    this.search = false;
    this.user = {
      phone_number: window.localStorage.getItem("todos_phone_number")
    }
    this.initializeItems(this.user);
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

  enableRemovIcon() {
    this.removeicon = !this.removeicon
  }

  enableAddIcon() {
    this.addicon = !this.addicon;
  }

  groupDetailView(user) {
    this.navCtrl.push(GroupDeatilPage, {
      page: "userPage",
      selected_user: user
    });
  }

  showSearch() {
    this.search = !this.search;
    if(this.search == true){
      setTimeout(() => {
        this.searchToFocusAbout.setFocus();
      }, 600)

    }
  }

  initializeItems(user) {
    this.userService.watchUsers(user).then((res) => {
      this.watchUsers = res;
      this.watchUserBackup = res;
      let phone_numbers = [];
      this.watchcount = 0;
      for (var i = 0; i < this.watchUsers.length; i++) {
        this.watchcount = this.watchcount + 1;
        this.watchUsers[i].color =
          '#' + Math.floor(Math.random() * 16777215).toString(16);
        phone_numbers.push("'" + this.watchUsers[i].phone_number + "'");
      }
      var data = {
        numbers: phone_numbers
      }
      // this.userService.otherUsers(data).then((resp) => {
      //   this.otherUsers = resp;
      //   this.otherUserBackup = resp;
      //   for(var i=0; i<this.otherUsers.length; i++){
      //     this.otherUsers[i].color =
      //       '#'+Math.floor(Math.random()*16777215).toString(16);
      //   }
      // })
    })
    this.userService.notInWatchList(user).then((resp) => {
      this.othercount = 0;
      this.otherUsers = resp;
      this.otherUserBackup = resp;
      for (var i = 0; i < this.otherUsers.length; i++) {
        this.othercount = this.othercount + 1;
        this.otherUsers[i].color =
          '#' + Math.floor(Math.random() * 16777215).toString(16);
      }
    })
  }

  onInput(ev: any) {
    this.allsearchUsers = []
    // Reset items back to all of the items
    this.watchUsers = this.watchUserBackup;
    this.otherUsers = this.otherUserBackup;
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.watchUsers = this.watchUsers.filter((item) => {
        if (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.allsearchUsers.push(item);
        }
        return (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    if (val && val.trim() != '') {
      this.otherUsers = this.otherUsers.filter((item) => {
        if (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.allsearchUsers.push(item);
        }
        return (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onCancel(ev: any) {
    const val = ev.target.value;
    this.initializeItems(this.user);
  }

  addToWatch(user) {
    this.presentLoadingDefault();
    let data = {
      watcher: this.user.phone_number,
      watching: user.phone_number
    }
    this.userService.addToWatchListUser(data).then((res) => {
      this.initializeItems(this.user);
      setTimeout(() => {
        this.enableAddIcon();
        this.loading.dismiss();
      }, 1800);
    })
  }

  removeFromWatch(user) {
    this.presentLoadingDefault();
    let data = {
      watcher: this.user.phone_number,
      watching: user.phone_number
    }
    this.userService.removeFromWatchListUser(data).then((res) => {
      this.initializeItems(this.user);
      setTimeout(() => {
        this.enableRemovIcon();
        this.loading.dismiss();
      }, 1800);
    })
  }

  addUser() {
    this.navCtrl.push(AddUserPage);
  }

  fillBox(conFil) {

    this.allsearchUsers = null;
    this.name = conFil.firstname;
    this.watchUsers = this.watchUsers.filter((item) => {
      return (item.firstname.toLowerCase().indexOf(conFil.firstname.toLowerCase()) > -1);
    })

    this.otherUsers = this.otherUsers.filter((item) => {
      return (item.firstname.toLowerCase().indexOf(conFil.firstname.toLowerCase()) > -1);
    })


  }

  searchUser() {
    this.watchUsers = this.watchUserBackup;
    this.otherUsers = this.otherUserBackup;
    this.allsearchUsers = [];
    this.watchUsers.filter((item) => {
      //console.log('onInput - ' + JSON.stringify(item))
      if (item.lastname != undefined) {
        this.allsearchUsers.push(item);
      }
    });
    this.otherUsers.filter((item) => {
      //console.log('onInput - ' + JSON.stringify(item))
      if (item.lastname != undefined) {
        this.allsearchUsers.push(item);
      }
    });

  }

}
