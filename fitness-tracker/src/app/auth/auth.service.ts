import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AuthData } from 'app/auth/auth-data.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from 'app/training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService) {
  }

  public initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    })
  }

  public registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result: any) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result: any) => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  public logout() {
    this.afAuth.auth.signOut();
  }

  public isAuth() {
    return this.isAuthenticated;
  }
}
