import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DiscussionService } from '../../providers/discussion.service';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
  allMessages: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public discussionService: DiscussionService) {
    this.initial();
  }

  initial() {
    var discuss = {
      discussionId: this.navParams.get('discussId')
    }
    this.discussionService.getMessages(discuss).then((res) => {
      this.allMessages = res;
      console.log(res)
    })
  }
  addMessage() {
    let message = {
      message: "",
      sender: "",
      time: "",
      discussion: ""
    }
    this.discussionService.addMessages(message).then((res) => {

    })
  }

}

