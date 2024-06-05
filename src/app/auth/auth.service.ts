import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  idToken,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isQueryingSubject = new BehaviorSubject<boolean>(false);
  isQuerying$ = this.isQueryingSubject.asObservable();
  signinError = new BehaviorSubject<string>('');
  signinError$ = this.signinError.asObservable();
  user$ = user(this.auth);
  authState$ = authState(this.auth);
  idToken$ = idToken(this.auth);

  constructor(private auth: Auth) {}

  signin(email: string, password: string) {
    this.isQueryingSubject.next(true);
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential;
        console.log(user);
      })
      .catch((error) => {
        this.signinError.next(error.code);
      });
    this.isQueryingSubject.next(false);
  }

  logout() {
    signOut(this.auth);
  }
}
