import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  public isAuthenticated: Observable<any>;

  constructor(
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authenticationService.isAuthenticated.asObservable()
  }

  public login() {
    window.location.href = 'https://animal-crossing.auth.us-east-1.amazoncognito.com/login?client_id=3l8tlpgkpkqo5n6nrivqeklt8r&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:4200/user-verify'
  }

  public logout() {
    this.authenticationService.logout();
  }
}
