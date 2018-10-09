import { Component } from '@angular/core';
import { NavController, ActionSheetController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { GroupService } from '../../providers/group.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'page-addGroup',
  templateUrl: 'addGroup.html'
})

export class AddGroupPage {
  myForm: FormGroup;
  loading: any;

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public grpService: GroupService, public viewCtrl: ViewController, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.myForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }

  showAlert(title, subtitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  addNewGroup() {
    if (this.myForm.value.title == null || this.myForm.value.title == "" || this.myForm.value.title == undefined) {
      this.showAlert("Required", "Title must be defined");
    } else {
      this.presentLoadingDefault();
      this.grpService.addGroup(this.myForm.value).then((res) => {
        this.loading.dismiss();
        this.viewCtrl.dismiss();
      })
    }
  }
}
