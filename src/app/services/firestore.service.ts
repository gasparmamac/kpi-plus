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
import { Observable, catchError, from, map } from 'rxjs';

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
  fuel_date: Date | Timestamp | null | string;
  fuel_or: string | null;
  fuel_amt: number | null;
  fuel_item: string | null;
  disp_encoder: string;
  disp_encoded_date: Date | Timestamp;

  wd_type: string | null;
  disp_rate: number | null;
  inv_date: Date | Timestamp | null | string;
  inv_no: string | null;
  inv_encoder: string;
  inv_encoded_date: Date | Timestamp;

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
  ): Observable<DocumentReference> {
    const collectionReference = collection(this.firestore, collectionName);
    return from(addDoc(collectionReference, data));
  }

  // Create a document by ID -> creates non-existing data, overwrites the field otherwise.
  createDocByID(
    collectionName = 'dispatch',
    id: string,
    data: DispatchModel
  ): Observable<void> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return from(setDoc(documentReference, data, { merge: true }));
  }

  // Read a document by ID
  readADocById(
    collectionName = 'dispatch',
    id: string
  ): Observable<DocumentSnapshot> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return from(getDoc(documentReference));
  }

  // Update a document by ID
  updateDoc(
    collectionName = 'dispatch',
    id: string,
    data: any
  ): Observable<void> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return from(updateDoc(documentReference, data));
  }

  // Delete a document by ID
  deleteDoc(collectionName = 'dispatch', id: string): Observable<void> {
    const documentReference = doc(this.firestore, `${collectionName}/${id}`);
    return from(deleteDoc(documentReference));
  }

  // for dashboard - no O.R.
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

  // for dashboard - no Payroll
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
    return collectionData(query, { idField: 'id' }).pipe(
      map((data) =>
        data.map((item) => {
          return {
            ...item,
            id: item.id,
            disp_date: item['disp_date']?.toDate(),
            inv_date: item['inv_date']?.toDate(),
            payroll_date: item['payroll_date']?.toDate(),
            or_date: item['or_date']?.toDate(),
          };
        })
      )
    ) as Observable<DispatchModel[]>;
  }
}
