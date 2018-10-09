import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';
import { CountryPickerModule } from 'ngx-country-picker'
import { Contacts } from '@ionic-native/contacts';
import { OneSignal } from '@ionic-native/onesignal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebaseConfig } from '../config';
import { Keyboard } from '@ionic-native/keyboard';
import { SQLite } from '@ionic-native/sqlite';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DiscussionPage } from '../pages/discussion/discussion';
import { AddTasksPage } from '../pages/addtasks/addTasks';
import { GroupDeatilPage } from '../pages/groupDetail/groupDetail';
import { MessagePage } from '../pages/message/message';
import { LoginPage } from '../pages/login/login';
import { VerifyPage } from '../pages/verify/verify';
import { AddGroupPage } from '../pages/addGroup/addGroup';
import { AddDiscussionPage } from '../pages/addDiscussion/addDiscussion';
import { AddUserPage } from '../pages/addUser/addUser';
import { TasksByMePage } from '../pages/tasksAssignedByMe/tasksByMe';
import { TasksToMePage } from '../pages/tasksAssignedToMe/tasksToMe';

import { ProjectService } from '../providers/projects.service';
import { AuthService } from '../providers/auth.service';
import { TaskService } from '../providers/tasks.service';
import { GroupService } from '../providers/group.service';
import { UserService } from '../providers/users.service';
import { DiscussionService } from '../providers/discussion.service';
import { SQLiteService } from '../providers/sqlite.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DiscussionPage,
    DashboardPage,
    AddTasksPage,
    GroupDeatilPage,
    MessagePage,
    LoginPage,
    VerifyPage,
    AddGroupPage,
    AddDiscussionPage,
    AddUserPage,
    TasksByMePage,
    TasksToMePage
  ],
  imports: [
    OrderModule,
    FilterPipeModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    CountryPickerModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig.fire)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DiscussionPage,
    DashboardPage,
    AddTasksPage,
    GroupDeatilPage,
    MessagePage,
    LoginPage,
    VerifyPage,
    AddGroupPage,
    AddDiscussionPage,
    AddUserPage,
    TasksByMePage,
    TasksToMePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatePicker,
    DatePipe,
    Contacts,
    OneSignal,
    AuthService,
    TaskService,
    GroupService,
    ProjectService,
    UserService,
    DiscussionService,
    GooglePlus,
    AngularFireAuth,
    Keyboard,
    SQLite,
    SQLiteService
  ]
})
export class AppModule { }
