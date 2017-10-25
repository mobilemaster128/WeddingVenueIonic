import { Component, ViewChild, ElementRef } from "@angular/core";
import { Content } from "ionic-angular";
import { NavController, NavParams } from "ionic-angular";
import { LocationDetailPage } from "../location/location";
import { API } from "../../providers/api-table";
import { ApiProvider } from "../../providers/api/api";
import { Platform } from "ionic-angular";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  MapType
} from "@ionic-native/google-maps";

declare var google;
/**
 * Generated class for the SearchResultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: "page-result",
  templateUrl: "result.html"
})
export class SearchResultPage {
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  private venues;
  private serverURL: string;
  private viewtype: string;
  private status: {
    total?: number;
    current?: number;
    size?: number;
    pages?: number;
  } = {};
  private body = {};
  private isAll = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleMaps: GoogleMaps,
    private api: ApiProvider,
    public platform: Platform
  ) {
    this.serverURL = API.siteURL;
    this.venues = navParams.get("venues");
    this.body = navParams.get("body");
    this.status = navParams.get("status");
    this.viewtype = "list";
    if (this.status.pages <= 1) {
      this.isAll = true;
    }
  }

  ionViewDidLoad() {
    let element = this.mapElement.nativeElement;
    element.hidden = true;
    this.platform.ready().then(() => {
      if (!this.platform.is("core")) {
        let center = this.getCenter();
        this.loadMapforMobile(center.lat, center.lon, element);
      }
    });
    console.log("ionViewDidLoad SearchResultPage");
  }

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");
    if (this.status.pages > this.status.current) {
      this.status.current++;
      this.body["CurrPage"] = this.status.current;
      console.log(JSON.stringify(this.body));
      let headers = { "Content-Type": "application/json" };
      this.api.post(API.DoSearch, this.body, headers).then(
        data => {
          console.log(JSON.stringify(data));
          if (data.PageResults.length > 0) {
            this.venues = this.venues.concat(data.PageResults);
          } else {
          }
          setTimeout(() => {
            console.log("Async operation has ended");
            infiniteScroll.complete();
          }, 1000);
        },
        error => {
          console.log("error");
        }
      );
    } else {
      this.isAll = true;
    }
  }

  doRefresh(refresher) {
    console.log("Begin async operation", refresher);
    this.body["CurrPage"] = 1;
    console.log(JSON.stringify(this.body));
    let headers = { "Content-Type": "application/json" };
    this.api.post(API.DoSearch, this.body, headers).then(
      data => {
        console.log(JSON.stringify(data));
        if (data.PageResults.length > 0) {
          this.venues = data.PageResults;
        } else {
        }
        this.isAll = false;
        setTimeout(() => {
          console.log("Async operation has ended");
          refresher.complete();
        }, 1000);
      },
      error => {
        console.log("error");
      }
    );
  }

  listView() {
    this.viewtype = "list";
    let element = this.mapElement.nativeElement;
    element.hidden = true;
  }

  mapView() {
    this.viewtype = "map";
    let center = this.getCenter();
    let element = this.mapElement.nativeElement;
    element.hidden = false;
    if (!this.platform.is("core")) {
      this.moveMap(center.lat, center.lon);
    } else {
      this.loadMapforWeb(center.lat, center.lon, element);
    }
  }

  getCenter() {
    var center = { lat: 0, lon: 0 };
    for (let venus of this.venues) {
      center.lat += venus.Lat;
      center.lon += venus.Lon;
    }
    center.lat /= this.venues.length;
    center.lon /= this.venues.length;
    return center;
  }

  moveMap(lat, lon) {
    if (!this.platform.is("core")) {
      let position: CameraPosition = {
        target: new LatLng(lat, lon),
        zoom: 18,
        tilt: 30
      };
      this.map.moveCamera(position);
    }
  }

  loadMapforMobile(lat, lon, element) {
    //let element: HTMLElement = document.getElementById("map");
    let current: LatLng = new LatLng(lat, lon);
    let position: CameraPosition = {
      target: current,
      zoom: 16
    };

    let mapOptions: GoogleMapOptions = {
      mapType: "MAP_TYPE_ROADMAP",
      controls: {
        compass: true,
        myLocationButton: true,
        indoorPicker: false,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: false,
        zoom: true,
        rotate: true
      },
      styles: [],
      camera: position,
      preferences: {
        zoom: {
          minZoom: 3,
          maxZoom: 20
        },
        building: true
      }
    };
    this.map = this.googleMaps.create(
      element, //this.mapElement.nativeElement,
      mapOptions
    );
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log("Map is ready!");
      // create new marker
      let markerOptions = {
        position: position,
        title: "Your Current Location"
      };

      const marker: Marker = this.map
        .addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
        });
    });
  }

  loadMapforWeb(lat, lon, element) {
    let position = new google.maps.LatLng(lat, lon);

    let mapOptions = {
      center: position,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map = new google.maps.Map(element, mapOptions);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });

    let content = "<h4>Information!</h4>";

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  gotoDetail(venue) {
    this.navCtrl.push(LocationDetailPage, {
            venueid: venue.VenueID,
            startDate: this.body['StartDate'],
            endDate: this.body['EndDate']
          });
  }
}
