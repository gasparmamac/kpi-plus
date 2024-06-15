import { Injectable } from '@angular/core';
import { DispatchModel, FirestoreService } from '../services/firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private showTableSubject = new BehaviorSubject<boolean>(false);
  private dispatchItemsSubject = new BehaviorSubject<DispatchModel[]>([]);
  private feedbackMsgSubject = new BehaviorSubject<string>(
    '--- no query to display ---'
  );

  loading$ = this.loadingSubject.asObservable();
  showTable$ = this.showTableSubject.asObservable();
  dispatchItems$ = this.dispatchItemsSubject.asObservable();
  feedbackMsg$ = this.feedbackMsgSubject.asObservable();

  private cacheObj: { [key: string]: DispatchModel[] } = {};

  constructor(private firestoreService: FirestoreService) {}

  private updateCacheObj(key: string, dispatchArr: DispatchModel[]) {
    if (this.cacheObj.hasOwnProperty(key)) {
      console.log(`This key "${key}" exist. return the dspatchArray.`);
      return this.cacheObj[key];
    } else {
      console.log(`This key does not exist: ${key}`);
      console.log(
        `This key "${key}" does NOT exist. Add the dspatchArray to the cache then return the dispatch array.`
      );
      this.cacheObj[key] = dispatchArr;
      return this.cacheObj[key];
    }
  }

  private setShowTable(cacheObj: object) {
    const keyArr = Object.keys(cacheObj);
    if (keyArr.length === 0) {
      this.feedbackMsgSubject.next('--- no found data ---');
      this.showTableSubject.next(false);
    } else {
      this.showTableSubject.next(true);
    }
  }
  async getDispatchItems(filterValue: string) {
    this.loadingSubject.next(true);
    // check if query is cached. return cache array if true. else go to firestore
    if (this.cacheObj.hasOwnProperty(filterValue)) {
      this.dispatchItemsSubject.next(this.cacheObj[filterValue]);
      this.setShowTable(this.cacheObj[filterValue]);
      this.loadingSubject.next(false);
    } else {
      try {
        this.cacheObj[filterValue] = await this.firestoreService
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

        this.dispatchItemsSubject.next(this.cacheObj[filterValue]);
        this.setShowTable(this.cacheObj[filterValue]);
        this.loadingSubject.next(false);
      } catch (error) {
        this.loadingSubject.next(false);
        console.log('Error occured in fetching dispatch items: ', error);
      }
    }
  }

  async addDispatchItem(data: DispatchModel) {
    this.loadingSubject.next(true);
    try {
      await this.firestoreService
        .createDoc('dispatch', data)
        .then((createdDoc) => {
          const id = createdDoc.id;
          console.log('Created doc id : ', id);
          // add the added dispatch to each cache item
          const addedDispatchItem = { ...data, id: id };
          Object.keys(this.cacheObj).map((key) => {
            this.cacheObj[key] = [...this.cacheObj[key], addedDispatchItem];
          });
        });

      this.loadingSubject.next(false);
    } catch (error) {
      this.loadingSubject.next(false);
      console.log('Error in adding dispatch item: ', error);
    }
  }
}
