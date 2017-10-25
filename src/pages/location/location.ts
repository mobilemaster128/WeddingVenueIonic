import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { RequestPage } from "../request/request";
import { CalendarPage } from "../calendar/calendar";
import { API } from "../../providers/api-table";
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the LocationDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: "page-location",
  templateUrl: "location.html"
})
export class LocationDetailPage {
  private venueid;
  private venue;
  private startDate;
  private endDate;
  private serverURL: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider
  ) {
    this.serverURL = API.siteURL;
    this.venueid = navParams.get("venueid");
    this.startDate = navParams.get("startDate") != null ? navParams.get("startDate") : new Date().toISOString();
    this.endDate = navParams.get("endDate");
  }

  ionViewDidLoad() {
    let body = { VenueID: this.venueid };
    let headers = { "Content-Type": "application/json" };
    this.api.post(API.GetVenueDetails, body, headers).then(
      data => {
        console.log(JSON.stringify(data));
        if (data.Ok) {
          this.venue = data.VenueDetail;
        } else {
          console.log(data.Msg);
        }
      },
      error => {
        console.log("error");
      }
    );
    console.log("ionViewDidLoad LocationDetailPage");
  }

  see_map() {
    //this.navCtrl.push()
  }

  request() {
    this.navCtrl.push(RequestPage, {
            venueid: this.venue.ID,
            picture: this.venue.Pict1,
            startDate: this.startDate,
            endDate: this.endDate
          });
  }

  calendar() {
    this.navCtrl.push(CalendarPage, {
            venueid: this.venue.ID,
            picture: this.venue.Pict1,
            startDate: this.startDate,
            endDate: this.endDate
          });
  }
}
