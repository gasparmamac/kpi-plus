import { Injectable } from '@angular/core';
import { DispatchModel, FirestoreService } from '../services/firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private dispatchItemsSubject = new BehaviorSubject<DispatchModel[]>([]);

  loading$ = this.loadingSubject.asObservable();
  dispatchItems$ = this.dispatchItemsSubject.asObservable();

  constructor(private firestoreService: FirestoreService) {}

  async getDispatchItems(filterValue: string) {
    this.loadingSubject.next(true);
    try {
      const dispatchItems = await this.firestoreService
        .readDocsByQuery(filterValue, 'dispatch')
        .then((snapshot) =>
          snapshot.docs.map((doc) => {
            const data = doc.data();
            if (data['disp_date']) {
              data['disp_date'] = data['disp_date'].toDate();
            }
            if (data['inv_date']) {
              data['inv_date'] = data['inv_date'].toDate();
            }
            if (data['or_date']) {
              data['or_date'] = data['or_date'].toDate();
            }
            if (data['payroll_date']) {
              data['payroll_date'] = data['payroll_date'].toDate();
            }
            const updatedData = { ...data, id: doc.id };
            return updatedData as DispatchModel;
          })
        );
      this.dispatchItemsSubject.next(dispatchItems);
      this.loadingSubject.next(false);
    } catch (error) {
      this.loadingSubject.next(false);
      console.log('Error occured in fetching dispatch items: ', error);
    }
  }

  async addDispatchItem(data: DispatchModel) {
    this.loadingSubject.next(true);
    try {
      const createDocResponse = await this.firestoreService.createDoc(
        'dispatch',
        data
      );
      console.log('Create doc response: ', createDocResponse);
      this.loadingSubject.next(false);
    } catch (error) {
      this.loadingSubject.next(false);
      console.log('Error in adding dispatch item: ', error);
    }
  }
}
