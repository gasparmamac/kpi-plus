import { Injectable } from '@angular/core';
import { BehaviorSubject, flatMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  constructor() {}
}
