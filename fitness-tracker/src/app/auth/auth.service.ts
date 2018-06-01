import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { User } from 'app/auth/user.model';
import { AuthData } from 'app/auth/auth-data.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User = null;

  constructor(private router: Router) {
  }

  public registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccessfully();
  }

  public login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccessfully();
  }

  public logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  public getUser() {
    return { ...this.user };
  }

  public isAuth() {
    return this.user !== null;
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
