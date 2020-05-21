import { Injectable } from "@angular/core";
import { Constants } from 'src/app/constants/constants';

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor() {}

  public saveUserTokenCookie(tokenObj: any) {
    const expirationDate = new Date(
      Date.now() + +tokenObj["expires_in"]
    ).toUTCString();

    document.cookie = `${Constants.cookieTokenName}=${tokenObj["id_token"]} ; expires = ${expirationDate}`;
  }
}