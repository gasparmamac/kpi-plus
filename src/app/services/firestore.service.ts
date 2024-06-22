import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Query,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, catchError, map } from 'rxjs';

// dispatch item data model
export interface DispatchModel {
  id?: string;
  disp_date: Date | Timestamp;
  disp_slip: string;
  route: string;
  odz_route: string | null;
  destination: string;
  cbm: number;
  drops: number;
  qty: number;
  plate_no: string;
  backup_plate_no: string | null;
  driver: string;
  extra_driver: string | null;
  helper: string;
  extra_helper: string | null;
  odo_start: number;
  odo_end: number;

  wd_type: string | null;
  disp_rate: number | null;
  inv_date: Date | Timestamp | null | string;
  inv_no: string | null;
  payroll_date: Date | Timestamp | null;
  payroll_no: string | null;

  or_date: Timestamp | null | string;
  or_no: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  dispatchForInvoiceItems$!: Observable<DispatchModel[]>;
  noOrItems$!: Observable<DispatchModel[]>;
  noPayrollItems$!: Observable<DispatchModel[]>;

  constructor(private firestore: Firestore) {}

  // Create a document with auto-generated the id
  createDoc(
    collectionName = 'dispatch',
    data: DispatchModel
  ): Promise<DocumentReference> {
    const collectionReference = collection(this.firestore, collectionName);
    return addDoc(collectionReference, data);
  }

  // Create a document by ID -> creates non-existing data, overwrites the field otherwise.
  createDocByID(
    collectionName = 'dispatch',
    id: string,
    data: DispatchModel
  ): Promise<void> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return setDoc(documentReference, data, { merge: true });
  }

  // Read a document by ID
  readADocById(
    collectionName = 'dispatch',
    id: string
  ): Promise<DocumentSnapshot> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return getDoc(documentReference);
  }

  readDocsByQuery(
    filterValue = 'no_payroll',
    collectionName = 'dispatch'
  ): Promise<QuerySnapshot> {
    let docs;
    const collectionReference = collection(this.firestore, collectionName);

    let collectionQuery;
    switch (filterValue) {
      case 'no_invoice':
        collectionQuery = query(
          collectionReference,
          or(
            where('inv_no', '==', null),
            where('inv_no', '==', ''),
            where('inv_date', '==', null),
            where('inv_date', '==', '')
          ),
          orderBy('disp_date', 'desc'),
          limit(100)
        );
        docs = getDocs(collectionQuery);
        break;
      case 'no_or':
        collectionQuery = query(
          collectionReference,
          or(
            where('or_no', '==', null),
            where('or_no', '==', ''),
            where('or_date', '==', null),
            where('or_date', '==', '')
          ),
          orderBy('disp_date', 'desc'),
          limit(100)
        );
        docs = getDocs(collectionQuery);
        break;
      case 'last100':
        collectionQuery = query(
          collectionReference,
          orderBy('disp_date', 'desc'),
          limit(100)
        );
        docs = getDocs(collectionQuery);
        break;
      default: //no_payroll
        collectionQuery = query(
          collectionReference,
          or(
            where('payroll_no', '==', null),
            where('payroll_no', '==', ''),
            where('payroll_date', '==', null),
            where('payroll_date', '==', '')
          ),
          orderBy('disp_date', 'desc'),
          limit(100)
        );
        docs = getDocs(collectionQuery);
    }
    return docs;
  }

  // Update a document by ID
  updateDoc(collectionName = 'dispatch', id: string, data: any): Promise<void> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return updateDoc(documentReference, data);
  }

  // Delete a document by ID
  deleteDoc(collectionName = 'dispatch', id: string): Promise<void> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(documentReference);
  }

  // invoice query
  loadDispatchForInvoice() {
    const collectionName = 'dispatch';
    const firestore = this.firestore;
    const collectionRef = collection(firestore, collectionName);
    const noInvoiceItemsQuery = query(
      collectionRef,
      or(
        where('inv_date', '==', null),
        where('inv_no', '==', null),
        where('inv_date', '==', ''),
        where('inv_no', '==', '')
      )
    );
    this.dispatchForInvoiceItems$ = collectionData(noInvoiceItemsQuery, {
      idField: 'id',
    }).pipe(
      map((data) =>
        data.map((item) => {
          console.log('item: ', item.id);
          return {
            ...item,
            disp_date: item['disp_date']?.toDate(),
            inv_date: item['inv_date']?.toDate(),
            payroll_date: item['payroll_date']?.toDate(),
            or_date: item['or_date']?.toDate(),
            plate_no:
              item['plate_no'] === 'BAC'
                ? `${item['plate_no']}: ${item['backup_plate_no']}`
                : item['plate_no'],
            destination: `${item['route'].toUpperCase()}: ${item[
              'destination'
            ].toLowerCase()}`,
          };
        })
      )
    ) as Observable<DispatchModel[]>;
  }

  // for dashboard
  noOrQuery(): Observable<DispatchModel[]> {
    const collectionName = 'dispatch';
    const firestore = this.firestore;
    const collectionRef = collection(firestore, collectionName);
    const noOrQueryBuild = query(
      collectionRef,
      or(
        where('or_date', '==', null),
        where('or_no', '==', null),
        where('or_date', '==', ''),
        where('or_no', '==', '')
      )
    );
    return this.getDataStream(noOrQueryBuild);
  }

  // for dashboard
  noPayrollQuery(): Observable<DispatchModel[]> {
    const collectionName = 'dispatch';
    const firestore = this.firestore;
    const collectionRef = collection(firestore, collectionName);
    const noPayrollQueryBuild = query(
      collectionRef,
      or(
        where('payroll_date', '==', null),
        where('payroll_no', '==', null),
        where('payroll_date', '==', ''),
        where('payroll_no', '==', '')
      )
    );
    return this.getDataStream(noPayrollQueryBuild);
  }

  private getDataStream(
    query: Query<DocumentData, DocumentData>
  ): Observable<DispatchModel[]> {
    return collectionData(query).pipe(
      map((data) =>
        data.map((item) => {
          return {
            ...item,
            disp_date: item['disp_date']?.toDate(),
            inv_date: item['inv_date']?.toDate(),
            payroll_date: item['payroll_date']?.toDate(),
            or_date: item['or_date']?.toDate(),
            plate_no:
              item['plate_no'] !== 'BAC'
                ? `${item['plate_no']}: ${item['backup_plate_no']}`
                : item['plate_no'],
            destination: `${item['route'].toUpperCase()}: ${item[
              'destination'
            ].toLowerCase()}`,
          };
        })
      )
    ) as Observable<DispatchModel[]>;
  }
}
