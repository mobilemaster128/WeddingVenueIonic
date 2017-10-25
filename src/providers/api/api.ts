import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: Http) {
    console.log('Hello ApiProvider Provider');
  }

  get(url, parameters, headers) {
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
      .toPromise()
      .then(res => res.json(), err => err);
  }

  post(url, parameters, headers) {
    let body = JSON.stringify(parameters);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options)
      .toPromise()
      .then(res => res.json(), err => err);
  }
}
