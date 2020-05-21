import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

  public login() {
    console.log('login here');
    window.location.href = 'https://animal-crossing.auth.us-east-1.amazoncognito.com/login?client_id=3l8tlpgkpkqo5n6nrivqeklt8r&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:4200/user-verify'
  }
}
