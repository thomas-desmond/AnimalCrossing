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
    this.authenticationService.login();
  }

  public logout() {
    this.authenticationService.logout();
  }
}
