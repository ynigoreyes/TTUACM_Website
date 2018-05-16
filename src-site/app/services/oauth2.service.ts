import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Oauth2Service {

  private googleEP: string = 'http://localhost:80/auth/google';
  private gitHubEP: string = 'http://localhost:80/auth/gitHub';
  private facebookEP: string = 'http://localhost:80/auth/facebook';
  constructor(private http: HttpClient) { }

  public googleAuth(): Observable<object> {
    console.log('hit');
    return this.http.get(this.googleEP);
  }

  public gitHubAuth(): Observable<object> {
    return this.http.get(this.gitHubEP);
  }

  public facebookAuth(): Observable<object> {
    return this.http.get(this.facebookEP);
  }



}
