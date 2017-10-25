import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { SearchGpsPage } from "../gps/gps";
import { SearchResultPage } from "../result/result";
import { API } from "../../providers/api-table";
import { ApiProvider } from "../../providers/api/api";
import { Geolocation } from "@ionic-native/geolocation";

/**
 * Generated class for the InputInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: "page-input",
  templateUrl: "input.html"
})
export class InputInfoPage {
  private keywords = [];
  private mykeywords = [];
  private event: {
    country?: string,
    state?: string,
    city?: string,
    street?: string,
    zip?: string,
    radius?: number,
    startDate?: string,
    endDate?: string,
    lat?: number,
    lon?: number,
    keywords?: [string]
  } = {};
  private subscription;
  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public platform: Platform,
    private api: ApiProvider
  ) {
    this.event.lat = 30;
    this.event.lon = -100;
    let headers = { "Content-Type": "application/json" };
    this.api.post(API.GetKeywords, {}, headers).then(
      data => {
        if (data.Ok) {
          this.keywords = data.Keywords;
        }
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
    this.event.startDate = this.event.endDate = new Date().toISOString();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      let option = {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
      };
      this.subscription = this.geolocation
        .watchPosition(option)
        .subscribe(response => {
          this.event.lat = response.coords.latitude;
          this.event.lon = response.coords.longitude;
        });
    });
    console.log("ionViewDidLoad InputInfoPage");
  }

  find_venues() {
    this.subscription.unsubscribe();
    var body = {
      VenueName: null,
      VenueURL: null,
      VenueEmail: null,
      VenuePhone: null,
      VenueAddress: this.event.street,
      VenueCity: this.event.city,
      VenueState: this.event.state,
      VenueZip: this.event.zip,
      VenueCountry: this.event.country,
      OwnerName: null,
      OwnerEmail: null,
      OwnerID: null,
      VenueStatus: null,
      All: null,
      Distance: this.event.radius,
      Keywords: this.event.keywords ? this.event.keywords.join() : "",
      Lat: this.event.lat,
      Lon: this.event.lon,
      StartDate: this.event.startDate,
      EndDate: this.event.endDate,
      PageSize: 10,
      CurrPage: 1
    };
    let headers = { "Content-Type": "application/json" };
    this.api.post(API.DoSearch, body, headers).then(
      data => {
        console.log(JSON.stringify(data));
        if (data.Ok != null && data.Ok == false) {
          console.log(data.Msg);
        } else if (data.TotalResults > 0) {
          let status = {
            total: data.TotalResults,
            current: data.CurrPage,
            size: data.PageSize,
            pages: data.TotalPages
          };
          this.navCtrl.push(SearchResultPage, {
            venues: data.PageResults,
            body: body,
            status: status
          });
        } else {
        }
      },
      error => {
        console.log("error");
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
        console.log(JSON.stringify(error));
      }
    );
  }

  use_gps() {
    this.navCtrl.push(SearchGpsPage, {
      lat: this.event.lat,
      lon: this.event.lon
    });
  }
}
