import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@acm-environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {}

  private updateResumeEP = `${environment.host}/api/users/update-resume`;

  /**
   * Updates the user's resume
   *
   * @requires authentication: a user must be logged in
   * @param {string} path a path to the firebase storage location
   */
  public uploadResume(path: string): Observable<Object> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': localStorage.getItem('id_token')
    });
    const post = this.http.put(this.updateResumeEP, { path }, { headers });

    return post;
  }
}
