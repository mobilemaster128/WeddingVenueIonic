import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { WeddingApp } from "./app.component";

import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { InputInfoPage } from "../pages/input/input";
import { SearchGpsPage } from "../pages/gps/gps";
import { SearchResultPage } from "../pages/result/result";
import { LocationDetailPage } from "../pages/location/location";
import { RequestPage } from "../pages/request/request";
import { CalendarPage } from "../pages/calendar/calendar";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from "@ionic-native/google-maps";

import { ApiProvider } from '../providers/api/api';

import { HttpModule } from '@angular/http';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [
    WeddingApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    InputInfoPage,
    SearchGpsPage,
    SearchResultPage,
    LocationDetailPage,
    RequestPage,
    CalendarPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(WeddingApp, {
      backButtonText: "",
      iconMode: "ios",
      //modalEnter: "modal-slide-in",
      //modalLeave: "modal-slide-out",
      tabsPlacement: "bottom",
      //pageTransition: "ios-transition"
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WeddingApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    InputInfoPage,
    SearchGpsPage,
    SearchResultPage,
    LocationDetailPage,
    RequestPage,
    CalendarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider
  ]
})
export class AppModule {}
