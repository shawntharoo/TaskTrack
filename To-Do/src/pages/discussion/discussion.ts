import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { DiscussionService } from '../../providers/discussion.service';
import { AddDiscussionPage } from '../addDiscussion/addDiscussion';

@Component({
  selector: 'page-discussion',
  templateUrl: 'discussion.html'
})
export class DiscussionPage {
  user: any;
  watchDiscussion : any;
  watchDisBackup : any;
  otherDiscussion : any;
  otherDisBackup : any;
  removeicon : any;
  addicon : any;
  search :any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public discussService : DiscussionService) {

  }

  enableRemovIcon() {
    this.removeicon = !this.removeicon
  }

  enableAddIcon() {
    this.addicon = !this.addicon;
  }

  showSearch() {
    this.search = !this.search;
  }

  ionViewWillEnter(){
    this.search = false;
    this.user = {
      phone_number: window.localStorage.getItem("todos_phone_number")
    }
    this.initializeItems(this.user);
  }

  initializeItems(user) {
    this.discussService.watchDiscussions(user).then((res) => {
      this.watchDiscussion = res;
      this.watchDisBackup = res;
      var discussion_ids = [];
      for (var i = 0; i < this.watchDiscussion.length; i++) {
         discussion_ids.push("'" + this.watchDiscussion[i].idDiscussion + "'");
      }
      var data = {
        phone_number: this.user.phone_number,
        discussion_ids : discussion_ids
      }
      this.discussService.otherDiscussions(data).then((resp) => {
        this.otherDiscussion = resp;
        this.otherDisBackup = resp;
      })
    })
  }

  onInput(ev: any) {
    this.watchDiscussion = this.watchDisBackup;
    this.otherDiscussion = this.otherDisBackup;
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.watchDiscussion = this.watchDiscussion.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    if (val && val.trim() != '') {
      this.otherDiscussion = this.otherDiscussion.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addNewDiscussion(descussion){
    this.navCtrl.push(AddDiscussionPage);
  }

  viewMessage(descussion){
    this.navCtrl.push(MessagePage, {
      discussId : descussion.idDiscussion
    });
  }

  addToWatch(discussion) {
    let data = {
      watcher: this.user.phone_number,
      watching: discussion.idDiscussion
    }
    this.discussService.addToWatchListDiscussion(data).then((res) => {
      this.initializeItems(this.user);
      this.enableAddIcon();
    })
  }

  removeFromWatch(discussion) {
    let data = {
      watcher: this.user.phone_number,
      watching: discussion.idDiscussion
    }
    this.discussService.removeFromWatchListDiscussion(data).then((res) => {
      this.initializeItems(this.user);
      this.enableRemovIcon();
    })
  }

}
