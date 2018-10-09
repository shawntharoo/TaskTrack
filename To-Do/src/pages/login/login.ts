import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { AuthService } from '../../providers/auth.service'
import { VerifyPage } from '../verify/verify';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginInit: boolean = true
  loginDetEnter: boolean = false
  loginForm: FormGroup;
  subTitle: string = 'Create a Todos account and add your team members'
  country: any;
  countries: ICountry[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public countryPickerService: CountryPickerService, public authService: AuthService, public loadingCtrl: LoadingController, public altctrl: AlertController) {
    this.countryPickerService.getCountries().subscribe((countries: ICountry[]) => //get all country
      this.countries = countries);  // store it in countries
    this.loginForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      phone_number: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
      country_code: ['94']
    })
  }

  login(user) {

    if (user.firstname == null || user.firstname == "" || user.firstname == undefined || user.phone_number == null || user.phone_number == "" || user.phone_number == undefined) {
      this.showAlert("Error", "Fields cannot be empty");
    } else {
      user.phone_number = user.phone_number.replace(/ /g, '').replace(/-/g, '').replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "")

      if (user.phone_number.charAt(0) == '0') {
        user.phone_number = user.phone_number.replace('0', '')
      }
      else if (user.phone_number.charAt(0) == '9' && user.phone_number.charAt(1) == '4' && user.phone_number.length == 11) {
        user.phone_number = user.phone_number.substring(2);
      }
      else if (user.phone_number.charAt(0) == '9' && user.phone_number.charAt(1) == '4' && user.phone_number.charAt(2) == '0' && user.phone_number.length == 12) {
        user.phone_number = user.phone_number.substring(3);
      }

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      // this.navCtrl.push(VerifyPage, user)
      this.authService.receiveSMS(user).then((response) => {
        console.log(response)
        this.navCtrl.push(VerifyPage, user)
        loading.dismiss();
      }, (err) => {
        console.log(err)
        loading.dismiss();
      }
      )
    }

  }

  onInitButtonClick() {
    this.loginInit = false
    this.loginDetEnter = true
    this.subTitle = 'Let\'s get started'
  }

  showAlert(title, subtitle) {
    const alert = this.altctrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then(
      (res) => {
        this.showAlert("google",JSON.stringify(res));
        console.log(res)
      },
      error => {
        this.showAlert("google",error.message);
        console.log(error.message)
      }
    );
  }

}
