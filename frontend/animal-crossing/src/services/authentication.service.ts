import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor() { }

  public verifyUserCode(code: string) {
    console.log('handle the code here in service ', code);
  }
}
