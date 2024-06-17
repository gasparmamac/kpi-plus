import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { DispatchModel, FirestoreService } from '../services/firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchService implements OnInit, OnDestroy {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private showTableSubject = new BehaviorSubject<boolean>(false);
  private dispatchItemsSubject = new BehaviorSubject<DispatchModel[]>([]);
  private feedbackMsgSubject = new BehaviorSubject<string>(
    '--- no query to display ---'
  );
  public filterValueSubject = new BehaviorSubject<string>('');

  loading$ = this.loadingSubject.asObservable();
  showTable$ = this.showTableSubject.asObservable();
  dispatchItems$ = this.dispatchItemsSubject.asObservable();
  feedbackMsg$ = this.feedbackMsgSubject.asObservable();

  private cacheObj: { [key: string]: DispatchModel[] } = {};
  private filterValue$ = this.filterValueSubject.asObservable();

  constructor(private firestoreService: FirestoreService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {
    if (this.filterValueSubject) this.filterValueSubject.unsubscribe();
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

  async getDispatchItems() {
    this.loadingSubject.next(true);
    this.filterValue$.subscribe(async (filterValue) => {
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
    });
  }

  async addDispatchItem(dispatchFormData: DispatchModel) {
    this.loadingSubject.next(true);
    try {
      await this.firestoreService
        .createDoc('dispatch', dispatchFormData)
        .then((createdDoc) => {
          const id = createdDoc.id;
          // add the added dispatch to each cache item
          const addedDispatchItem = { ...dispatchFormData, id: id };
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

  async deleteDispatch(id: string) {
    this.loadingSubject.next(true);
    try {
      await this.firestoreService
        .deleteDoc('dispatch', id)
        .then(() => {
          // remove the deleted dispatch on cache item
          Object.keys(this.cacheObj).map((key) => {
            const newArr = this.cacheObj[key].filter((item) => item.id !== id);
            console.log(newArr);
            this.cacheObj[key] = newArr;
          });
        })
        .then(() => this.getDispatchItems());
    } catch (error) {
      this.loadingSubject.next(false);
      console.log('Error in deleting dispatch item: ', error);
    }
  }

  async updateDispatch(id: string, editDispatchFormData: DispatchModel) {
    this.loadingSubject.next(true);
    try {
      await this.firestoreService
        .updateDoc('dispatch', id, editDispatchFormData)
        .then(() => {
          // iterate cache object
          Object.keys(this.cacheObj).map((key) => {
            // iterate dispatch array and update the object
            let updatedCache = this.cacheObj[key].map((obj) => {
              if (obj.id === id) {
                return { ...editDispatchFormData, id: id };
              } else {
                return obj;
              }
            });
            // update cache object
            this.cacheObj[key] = updatedCache;
          });
          this.loadingSubject.next(false);
        });
    } catch (error) {
      console.log('Error updating dispatch: ', error);
    }
  }
}
