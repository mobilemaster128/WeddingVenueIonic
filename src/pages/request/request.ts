import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { API } from "../../providers/api-table";
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the RequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: "page-request",
  templateUrl: "request.html"
})
export class RequestPage {
  private event: {
    name?: string;
    guest?: number;
    type?: string;
    comments?: string;
    startDate?: string;
    endDate?: string;
  } = {};
  private venueid;
  private picture;
  private serverURL: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider
  ) {
    this.serverURL = API.siteURL;
    this.venueid = navParams.get("venueid");
    this.picture = navParams.get("picture");
    this.event.startDate = navParams.get("startDate");
    this.event.endDate = navParams.get("endDate");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RequestPage");
  }

  request() {
    let headers = { "Content-Type": "application/json" };
    this.api
      .post(
        API.GetBookingEval,
        {
          VenueID: this.venueid,
          Start: this.event.startDate,
          End: this.event.endDate
        },
        headers
      )
      .then(
        data => {
          console.log(data);
          if (data.Available) {
            let body = {
              VenueID: this.venueid,
              Start: this.event.startDate,
              End: this.event.endDate,
              name: this.event.name,
              email: "",
              comments: this.event.comments,
              type: this.event.type,
              guests: this.event.guest
            };
            let headers = { "Content-Type": "application/json" };
            this.api.post(API.DoBooking, body, headers).then(
              data => {
                if (data.Ok) {
                  console.log(data);
                } else {
                  console.log(data.Msg);
                }
              },
              error => {
                console.log(JSON.stringify(error));
              }
            );
          } else {
            console.log(data.AltDates);
          }
        },
        error => {
          console.log(JSON.stringify(error));
        }
      );
  }
}
