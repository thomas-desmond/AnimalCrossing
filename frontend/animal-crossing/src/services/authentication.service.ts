import { Injectable } from "@angular/core";
import { Constants } from 'src/app/constants/constants';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private cookieService: CookieService) {}

  public saveUserTokenCookie(tokenObj: any) {
    const expirationDate = new Date(
      Date.now() + (+tokenObj["expires_in"] * 1000)
    )

    this.cookieService.set(Constants.cookieTokenName, tokenObj["id_token"], expirationDate);
  }
}