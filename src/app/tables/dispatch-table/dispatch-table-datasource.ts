import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subscription } from 'rxjs';
import { DispatchModel } from '../../services/firestore.service';
import { FormsService } from '../../forms/forms.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Timestamp } from '@angular/fire/firestore';

/**
 * Data source for the DispatchTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DispatchTableDataSource extends DataSource<DispatchModel> {
  data!: DispatchModel[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  subscriptions = new Subscription();
  searchInput$!: Observable<string>;

  constructor(
    private formsService: FormsService,
    private dashboardService: DashboardService
  ) {
    super();
    const subscription1 = this.dashboardService.noPayrollItems$.subscribe(
      (items) => {
        this.data = items;
        console.log('dispatch no payroll: ', this.data);
      }
    );

    this.searchInput$ = formsService.searchInput$;
    this.subscriptions.add(subscription1);
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
      return merge(
        this.dashboardService.noPayrollItems$,
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

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
