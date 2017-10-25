import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Platform } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
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
import { API } from "../../providers/api-table";
import { ApiProvider } from "../../providers/api/api";
import { SearchResultPage } from "../result/result";

declare var google;

/**
 * Generated class for the SearchGpsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: "page-gps",
  templateUrl: "gps.html"
})
export class SearchGpsPage {
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  private lat: number;
  private lon: number;
  private radius: number;
  private subscription;

  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public googleMaps: GoogleMaps,
    public navParams: NavParams,
    private api: ApiProvider,
    public platform: Platform
  ) {
    this.lat = navParams.get("lat");
    this.lon = navParams.get("lon");
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
        .subscribe(position => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          if (!this.platform.is("core")) {
            this.moveMap(this.lat, this.lon);
          } else {
            this.map.setCenter({ lat: this.lat, lng: this.lon });
          }
        });
    });
    console.log("ionViewDidLoad SearchGpsPage");
  }

  find_venues() {
    this.subscription.unsubscribe();
    var body = {
      VenueName: null,
      VenueURL: null,
      VenueEmail: null,
      VenuePhone: null,
      VenueAddress: null,
      VenueCity: null,
      VenueState: null,
      VenueZip: null,
      VenueCountry: null,
      OwnerName: null,
      OwnerEmail: null,
      OwnerID: null,
      VenueStatus: null,
      All: null,
      Distance: this.radius,
      Keywords: null,
      Lat: this.lat,
      Lon: this.lon,
      StartDate: new Date().toISOString,
      EndDate: null,
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
        console.log(JSON.stringify(error));
      }
    );
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      if (!this.platform.is("core")) {
        this.loadMapforMobile(this.lat, this.lon);
      } else {
        this.loadMapforWeb(this.lat, this.lon);
      }
    });
    console.log("ngAfterViewInit");
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

  loadMapforMobile(lat, lon) {
    let element: HTMLElement = document.getElementById("map");
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

  loadMapforWeb(lat, lon) {
    let position = new google.maps.LatLng(lat, lon);

    let mapOptions = {
      center: position,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

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
}
