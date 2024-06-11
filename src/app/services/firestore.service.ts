import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';

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
  inv_date: Date | Timestamp | null;
  inv_no: string | null;
  payroll_date: Date | Timestamp | null;
  payroll_no: string | null;

  or_date: Timestamp | null;
  or_no: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private noPayrollCache:
    | Promise<QuerySnapshot<DocumentData, DocumentData>>
    | undefined;

  private noInvoiceCache:
    | Promise<QuerySnapshot<DocumentData, DocumentData>>
    | undefined;

  private noORCache:
    | Promise<QuerySnapshot<DocumentData, DocumentData>>
    | undefined;

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

    switch (filterValue) {
      case 'no_invoice':
        if (this.noInvoiceCache) {
          return this.noInvoiceCache;
        } else {
          const collectionQuery = query(
            collectionReference,
            where('inv_no', '==', null),
            orderBy('inv_no'),
            limit(100)
          );
          this.noInvoiceCache = getDocs(collectionQuery);
          docs = this.noInvoiceCache;
        }
        break;
      case 'no_or':
        if (this.noORCache) {
          return this.noORCache;
        } else {
          const collectionQuery = query(
            collectionReference,
            where('or_no', '==', null),
            orderBy('or_no'),
            limit(100)
          );
          this.noORCache = getDocs(collectionQuery);
          docs = this.noORCache;
        }

        break;
      default: //no_payroll
        if (this.noPayrollCache) {
          return this.noPayrollCache;
        } else {
          const collectionQuery = query(
            collectionReference,
            where('payroll_no', '==', null),
            orderBy('payroll_no'),
            limit(100)
          );
          this.noPayrollCache = getDocs(collectionQuery);
          docs = this.noPayrollCache;
        }
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
}
