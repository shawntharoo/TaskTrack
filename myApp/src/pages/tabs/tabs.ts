import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { DiscussionPage } from '../discussion/discussion';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = DiscussionPage;

  constructor(public platform: Platform, public keyboard: Keyboard) {
    platform.ready().then(() => {
      keyboard.onKeyboardShow().subscribe(() => {
          document.body.classList.add('keyboard-is-open');
      });

      keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
      });
});
  }
}
