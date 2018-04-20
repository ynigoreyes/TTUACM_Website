import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent{
  profile: object;
  headers: Headers;
  loading: boolean = true;

  /**
   * Loads the user's profile before loading the rest of the HTML
   * One it is finished, the loading variable is set to false and the rest
   * of the HTML is loaded
   *
   * TODO: Move this to the auth.service.ts file so it look pretty. This is a
   * pretty hacky way of doing it.
   */
  constructor(
    private authService: AuthService,
    private http: Http) {

      this.headers = new Headers;

      this.headers.append('Content-type', 'application/json');
      this.headers.append('Authorization', this.authService.getToken());

      this.http.get('http://localhost:80/users/profile', { headers: this.headers })
        .subscribe(data => {
          this.profile = data.json();
          this.loading = false;
        });

    }

}
