import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiscussionService } from '../../providers/discussion.service';
import { TaskService } from '../../providers/tasks.service';

@Component({
    selector: 'page-addDiscussion',
    templateUrl: 'addDiscussion.html'
})
export class AddDiscussionPage {
    myform: FormGroup;
    user: any;
    tasks : any;

    constructor(public navCtrl: NavController, public discussionService: DiscussionService, public viewCtrl: ViewController, public taskService: TaskService) {
        this.myform = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            task: new FormControl('', Validators.required)
        });
    }


    ionViewDidLoad() {
        this.user = window.localStorage.getItem("todos_phone_number");
        let data = {
            phone_number : this.user
        }
        this.taskService.taskOfUser(data).then((res) => {
            this.tasks = res;
        })

    }

    addNewDiscussion() {
        let data = {
            formValues: this.myform.value,
            phone_number: this.user
        }
        this.discussionService.addDiscussion(data).then((response) => {
            if (response) {
                this.viewCtrl.dismiss();
            } else {
                this.viewCtrl.dismiss();
            }
        })
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}

