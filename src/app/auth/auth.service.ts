import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isQueryingSubject = new BehaviorSubject<boolean>(false);
  isQuerying$ = this.isQueryingSubject.asObservable();
  signinError = new BehaviorSubject<string>('');
  signinError$ = this.signinError.asObservable();

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
}
