import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { InputInfoPage } from '../input/input';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = InputInfoPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
