import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {
  private profile: object;
  private loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe(
        data => this.profile = data['user'],
        err => console.log('error'),
        () => {
          console.log(this.profile);
          this.loading = false;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

}
