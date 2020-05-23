import { Injectable } from "@angular/core";
import { Constants } from 'src/app/constants/constants';
import { CookieService } from 'ngx-cookie-service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'
import { shareReplay } from 'rxjs/operators';
import { UserData } from 'src/app/models/UserData';

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {

  public isAuthenticated$ = new Subject();
  private isAuthenticatedPreviousValue: boolean;
  public userData$: Observable<UserData>

  private getUserDataUrl = environment.apigatewayBaseUrl + '/get-user-data';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient
  ) {
    this.setupCookieSubject();
    this.setupUserInfo()
  }

  private setupCookieSubject() {
    setInterval(() => {
      const currentValue = this.cookieService.check(Constants.cookieTokenName);
      if (this.isAuthenticatedPreviousValue !== currentValue) {
        this.isAuthenticated$.next(this.cookieService.check(Constants.cookieTokenName));
        this.isAuthenticatedPreviousValue = currentValue;
      }
    }, 1000)
  }

  private setupUserInfo() {
    if (this.cookieService.check(Constants.cookieTokenName)) {
      const token = this.cookieService.get(Constants.cookieTokenName);
      const requestOptions = {
        headers: new HttpHeaders({
          'Authorization': token
        }),
      };
      this.userData$ = this.http.get<UserData>(this.getUserDataUrl, requestOptions).pipe(shareReplay());
    }
  }

  public saveUserTokenCookie(tokenObj: any) {
    const expirationDate = new Date(
      Date.now() + (+tokenObj["expires_in"] * 1000)
    )

    this.cookieService.set(Constants.cookieTokenName, tokenObj["id_token"], expirationDate);
    this.setupUserInfo();
  }

  public logout() {
    this.cookieService.delete(Constants.cookieTokenName);
    this.router.navigate(['/']);
  }

}