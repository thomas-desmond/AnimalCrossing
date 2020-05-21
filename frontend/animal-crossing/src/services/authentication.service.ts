import { Injectable } from "@angular/core";
import { Constants } from 'src/app/constants/constants';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {

  public isAuthenticated = new Subject();

  constructor(
    private router: Router,
    private cookieService: CookieService
    ) {
    setInterval(() => {
      this.isAuthenticated.next(this.cookieService.check(Constants.cookieTokenName));
    }, 1000)
  }

  public saveUserTokenCookie(tokenObj: any) {
    const expirationDate = new Date(
      Date.now() + (+tokenObj["expires_in"] * 1000)
    )

    this.cookieService.set(Constants.cookieTokenName, tokenObj["id_token"], expirationDate);
  }

  public logout() {
    this.cookieService.delete(Constants.cookieTokenName);
    this.router.navigate(['/']);
  }

}