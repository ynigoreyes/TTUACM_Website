import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@acm-environments/environment';
import { Observable } from 'rxjs';
import { Profile } from '../pages/profile/profile.component';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {}

  private updateResumeEP = `${environment.host}/api/users/update-resume`;
  private updateUserEP = `${environment.host}/api/users/update-user`;
  private saveUserToGoogleGroupEP = `${environment.host}/api/users/add-to-google-group`;

  /**
   * Updates the user's resume
   *
   * @deprecated - Start using .updateUser method
   *
   * @requires authentication: a user must be logged in
   * @param {string} path a path to the firebase storage location
   */
  public uploadResume(path: string): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: localStorage.getItem('id_token')
    });
    const post = this.http.put(this.updateResumeEP, { path }, { headers });

    return post;
  }

  /**
   * Sends the new user object to replace the old one
   *
   * data sent back is the new token and the user object
   * @returns an observable that emits an object literal payload
   */
  public updateUser(user: object): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: localStorage.getItem('id_token')
    });
    const post = this.http.put(this.updateUserEP, { user }, { headers });

    return post;
  }

  /**
   * Adds the user to a Google Group, this is for handling a user
   * choice in SDC
   */
  public saveUserToGoogleGroup(user: object): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: localStorage.getItem('id_token')
    });
    const post = this.http.put(this.saveUserToGoogleGroupEP, { user }, { headers });

    return post;
  }
}

export interface UpdateUserPayload {
  user: Profile; // The user profile,
  token: string;
  err: Error;
}
