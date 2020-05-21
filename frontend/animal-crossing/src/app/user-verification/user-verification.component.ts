import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/services/authentication.service";
import { tap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-user-verification",
  templateUrl: "./user-verification.component.html",
  styleUrls: ["./user-verification.component.scss"],
})
export class UserVerificationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.handleUserAuthentication();
  }

  handleUserAuthentication() {
    this.route.fragment
      .pipe(
        map((params) => this.redirectIfUnsuccessfulLogin(params)),
        tap((tokenObj: string) => this.authenticationService.saveUserTokenCookie(tokenObj)),
        catchError((err) => this.userAuthenticationErrorHandling(err))
      )
      .subscribe((params) => console.log(params));
  }

  private userAuthenticationErrorHandling(error: Error) {
    this.router.navigateByUrl("/");
    return "";
  }

  private redirectIfUnsuccessfulLogin(fragmentsParams: string) {
    const tokenObj = this.getFragmentsAsObject(fragmentsParams)

    const token = tokenObj["id_token"];
    const expDate = tokenObj["expires_in"];

    if (!token || !expDate) {
      throw new Error("Missing code");
    }

    return tokenObj;
  }

  private getFragmentsAsObject(fragmentsString: string) {
    const fragments = fragmentsString.split('&');
    const fragmentSplitUp = fragments.map(kv => kv.split('='));
    const fragmentObj = {};
    fragmentSplitUp.forEach(element => {
      fragmentObj[element[0]] = element[1];
    });
    return fragmentObj;
  }
}
