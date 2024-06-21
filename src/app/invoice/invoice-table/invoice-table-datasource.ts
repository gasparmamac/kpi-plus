import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { filter, map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subscription } from 'rxjs';
import {
  DispatchModel,
  FirestoreService,
} from '../../services/firestore.service';
import { Timestamp } from '@angular/fire/firestore';
import { FormsService } from '../../forms/forms.service';

// TODO: Replace this with your own data model type
// TODO: replace this with real data from your application
const DATA: DispatchModel[] = [];

/**
 * Data source for the InvoiceTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class InvoiceTableDataSource extends DataSource<DispatchModel> {
  data: DispatchModel[] = DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  searchInputSubscription = new Subscription();
  searchInput$;

  private forInvoiceItemsSubscription = new Subscription();

  constructor(
    private firestoreService: FirestoreService,
    private formsService: FormsService
  ) {
    super();
    this.firestoreService.loadDispatchForInvoice();

    this.searchInput$ = formsService.searchInput$;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DispatchModel[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      this.forInvoiceItemsSubscription =
        this.firestoreService.dispatchForInvoiceItems$.subscribe((data) => {
          console.log('data: ', data);
          this.data = data;
        });

      return merge(
        this.firestoreService.dispatchForInvoiceItems$,
        this.formsService.searchInput$,
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          const filteredData = this.getFilteredData(this.data);
          const sortedData = this.getSortedData(filteredData);
          return this.getPagedData(sortedData);
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  private getFilteredData(data: DispatchModel[]): DispatchModel[] {
    let filteredData: DispatchModel[] = [];
    this.searchInputSubscription = this.formsService.searchInput$.subscribe(
      (filterValue) => {
        filteredData = data.filter((item) =>
          this.matchesFilter(item, filterValue)
        );
      }
    );
    return filteredData;
  }

  private matchesFilter(item: DispatchModel, filterValue: string): unknown {
    return (
      item.disp_slip.toLowerCase().includes(filterValue) ||
      item.plate_no.toLowerCase().includes(filterValue) ||
      item.destination.toLowerCase().includes(filterValue)
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.forInvoiceItemsSubscription.unsubscribe();
    this.searchInputSubscription.unsubscribe();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DispatchModel[]): DispatchModel[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DispatchModel[]): DispatchModel[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'disp_date':
          return compare(a.disp_date, b.disp_date, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: Date | Timestamp,
  b: Date | Timestamp,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
