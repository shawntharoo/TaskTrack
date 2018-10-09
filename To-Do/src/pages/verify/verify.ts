import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { TabsPage } from '../tabs/tabs';
import { SQLiteService } from '../../providers/sqlite.service';
/**
 * Generated class for the VerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html',
})
export class VerifyPage {
  user: any = {
    firstname: this.navParams.get('firstname'),
    phone_number: this.navParams.get('phone_number'),
    country_code: this.navParams.get('country_code'),
    token: ''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService:AuthService, public loadingCtrl:LoadingController,  private sqliteservice: SQLiteService) {

  }

  verify(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.authService.verifyToken(this.user).then((response)=>{
      console.log(response)
      window.localStorage.setItem('todos_phone_number', this.user.country_code+''+this.user.phone_number);
      window.localStorage.setItem('todos_loginuser_name', this.user.firstname);
      loading.dismiss();
      // this.sqliteservice.deleteAllSqliteTables().then(res => {
      //   this.sqliteservice.getAllTasks();
      //   this.sqliteservice.getAllGroups();
      //   this.sqliteservice.getAllOnesignalIds();
      //   this.sqliteservice.getAllUsers();
      //   this.sqliteservice.getAllWatchUsers();
      // })
  
      this.navCtrl.setRoot(TabsPage);
    },(err)=>{
      loading.dismiss();
      console.log(err)
    })
  }
  ionViewDidLoad() {
  }

}
