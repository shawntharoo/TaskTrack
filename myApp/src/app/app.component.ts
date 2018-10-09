import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { UserService } from '../providers/users.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private oneSignal: OneSignal, private userService : UserService) {
    platform.ready().then(() => {
      if(platform.is('cordova')){
        console.error("android")
      }
      statusBar.styleDefault();
      splashScreen.hide();

      // var notificationOpenedCallback = function (jsonData) {
      //   console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      //   if (jsonData.notification.payload.additionalData != null) {
      //     console.log("Here we access addtional data");
      //     if (jsonData.notification.payload.additionalData.openURL != null) {
      //       console.log("Here we access the openURL sent in the notification data");

      //     }
      //   }
      // };
      // window["plugins"].OneSignal
      //   .startInit("eafd1be8-cb7a-4ae0-aa0a-6fce30754e10", "659911733986")
      //   .handleNotificationOpened(notificationOpenedCallback)
      //   .endInit();

      if (!(<any>window).cordova) {
        console.log('This is a native feature. Please use a device');
        return false;
      } else {
        console.log("onesignal")
        this.oneSignal.startInit("eafd1be8-cb7a-4ae0-aa0a-6fce30754e10", "659911733986");
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
        this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
        this.oneSignal.endInit();
      }

    });

    this.checkPreviousAuth();
  }

  private onPushReceived(payload: OSNotificationPayload) {
    // alert('Push recevied:' + payload.body);
  }

  private onPushOpened(payload: OSNotificationPayload) {
    // alert('Push opened: ' + payload.body);
  }

  checkPreviousAuth(): void {
    if ((window.localStorage.getItem('todos_phone_number') === "undefined" || window.localStorage.getItem('todos_phone_number') === null) &&
      (window.localStorage.getItem('todos_password') === "undefined" || window.localStorage.getItem('todos_password') === null)) {
      this.rootPage = LoginPage;
      //this.rootPage = TabsPage;
    } else {
      this.rootPage = TabsPage;
    }
  }

}
