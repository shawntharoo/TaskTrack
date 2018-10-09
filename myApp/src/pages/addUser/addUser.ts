import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { UserService } from '../../providers/users.service';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';


@Component({
  selector: 'page-addUser',
  templateUrl: 'addUser.html',
  providers: [Contacts]
})
export class AddUserPage {
  userForm: FormGroup;
  country: any;
  countries: ICountry[] = [];
  contactList: { name: any, phone: any }[] = [];
  contactListFiltered: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public countryPickerService: CountryPickerService, public userService: UserService, public viewCtrl: ViewController, private contacts: Contacts, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.countryPickerService.getCountries().subscribe((countries: ICountry[]) => //get all country
      this.countries = countries);  // store it in countries
    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      phone_number: ['', Validators.required],
      country_code: ['94']
    })
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  ionViewDidLoad() {
    this.contacts.find(['displayName', 'phoneNumbers'], { filter: "", multiple: true, hasPhoneNumber: true })
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          this.contactList.push({
            name: data[i]['_objectInstance'].name.givenName,
            phone: data[i]['_objectInstance'].phoneNumbers
          })
        }
      }, err => {
        console.log("contact " + err);
      });
  }

  searchUser(){
    this.contactListFiltered = [];
    this.contactList.filter((item) => {
      console.log(JSON.stringify(item))
      //console.log('onInput - ' + JSON.stringify(item))
      if (item.name != undefined) {
          this.contactListFiltered.push(item);
      }
    });
  }

  onInput(searchTerm: any) {
    this.contactListFiltered = [];
    if (searchTerm.target.value && searchTerm.target.value.trim() !== '' && this.contactList.length != 0) {
      this.contactList.filter((item) => {
        if (item.name != undefined) {
          if (item.name.toLowerCase().includes(searchTerm.target.value.toLowerCase())) {
            this.contactListFiltered.push(item);
          }
        }
      });
    }
  }

  fillBox(conFil) {
    if (conFil.phone.length > 1) {
      this.showRadioAlert(conFil.phone);
    } else if (conFil.phone.length == 1) {
      this.userForm.controls["phone_number"].setValue(conFil.phone[0].value.replace(/[^0-9]/ig, ''))
    } else {
      console.log("no contacts ")
    }
    this.contactListFiltered = null;
  }

  showRadioAlert(phoneNumbers) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Phone Number');
    for (var i = 0; i < phoneNumbers.length; i++) {
      alert.addInput({
        type: 'radio',
        label: phoneNumbers[i].value,
        value: phoneNumbers[i].value,
        checked: false
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.userForm.controls["phone_number"].setValue(data);
      }
    });
    alert.present();
  }

  AddUser(formValues) {
    if (formValues.firstname == null || formValues.firstname== "" || formValues.firstname == undefined || formValues.phone_number == null || formValues.phone_number== "" || formValues.phone_number == undefined) {
      this.showAlert("Error", "Fields cannot be empty");
    } else {

      formValues.phone_number = formValues.phone_number.replace(/ /g, '').replace(/-/g, '').replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "")
      if (formValues.phone_number.charAt(0) != '0' && formValues.phone_number.length == 9) {
        formValues.phone_number = '94' + '' + formValues.phone_number
      }
      else if (formValues.phone_number.charAt(0) == '0') {
        formValues.phone_number = '94' + '' + formValues.phone_number.replace('0', '')
      }
      else if (formValues.phone_number.charAt(0) == '9' && formValues.phone_number.charAt(1) == '4' && formValues.phone_number.length == 11) {
        formValues.phone_number = formValues.phone_number;
      }
      else if (formValues.phone_number.charAt(0) == '9' && formValues.phone_number.charAt(1) == '4' && formValues.phone_number.charAt(2) == '0' && formValues.phone_number.length == 12) {
        formValues.phone_number = formValues.phone_number.replace('0', '')
      }
      
    this.presentLoadingDefault();
    let user = {
      country_code: formValues.country_code,
      firstname: formValues.firstname,
      phone_number: formValues.phone_number
    }
    this.userService.addUser(user).then((res) => {
      this.viewCtrl.dismiss();
      this.loading.dismiss();
    })
  }
}

showAlert(title, subtitle) {
  const alert = this.alertCtrl.create({
    title: title,
    subTitle: subtitle,
    buttons: ['OK']
  });
  alert.present();
}

}
