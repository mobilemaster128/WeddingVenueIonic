import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { API } from "../../providers/api-table";
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the CalendarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: "page-calendar",
  templateUrl: "calendar.html"
})
export class CalendarPage {
  eventSource;
  viewTitle;
  isToday: boolean;
  private calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  private venueid;
  private startDate;
  private endDate;
  private picture;
  private bookings = [];
  private serverURL: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider
  ) {
    this.serverURL = API.siteURL;
    this.venueid = navParams.get("venueid");
    this.startDate = navParams.get("startDate");
    this.endDate = navParams.get("endDate");
    this.picture = navParams.get("picture");
    this.calendar.currentDate = new Date();
  }

  ionViewDidLoad() {
    let body = {
      VenueID: this.venueid,
      Start: this.startDate,
      End: this.endDate
    };
    let headers = { "Content-Type": "application/json" };
    this.api.post(API.GetVenueCalendar, body, headers).then(
      data => {
        if (data.Ok) {
          console.log(data.Bookings);
          this.bookings = data.Bookings;
        } else {
          console.log(data.Msg);
        }
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
    console.log("ionViewDidLoad CalendarPage");
  }

  onCurrentDateChanged(event) {
    
  }

  reloadSource(start, end) {
    
  }

  onEventSelected(event) {
    
  }

  onTimeSelected(event) {
    
  }

  onViewTitleChanged(event) {

  }

  request() {}
}
