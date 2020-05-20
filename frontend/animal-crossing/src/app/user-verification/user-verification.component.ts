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
    this.route.queryParams
      .pipe(
        map((params) => this.redirectIfNoCode(params)),
        tap((code: string) => this.authenticationService.verifyUserCode(code)),
        catchError((err) => this.userAuthenticationErrorHandling(err))
      )
      .subscribe((params) => console.log(params));
  }

  private userAuthenticationErrorHandling(error: Error){
    this.router.navigateByUrl("/");
    return '';
  }

  private redirectIfNoCode(params: any) {
    console.log("params");

    const code = params["code"];
    if (!code) {
      console.log("inside no code");

      throw new Error("Missing code");
    }
    console.log("return code ,", code);

    return code;
  }
}
