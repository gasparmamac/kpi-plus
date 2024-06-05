import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { DispatchModel } from '../services/firestore.service';
import { OnInit } from '@angular/core';

/**
 * Data source for the Dispatch view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DispatchDataSource
  extends DataSource<DispatchModel>
  implements OnInit
{
  data: DispatchModel[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = '';

  loading = new BehaviorSubject<boolean>(false);
  dataSubject = new BehaviorSubject<DispatchModel[]>([]);

  loading$ = this.loading.asObservable();
  data$ = this.dataSubject.asObservable();

  constructor() {
    super();
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
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
      return merge(this.data$, this.paginator.page, this.sort.sortChange).pipe(
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
          return compare(String(a.disp_date), String(b.disp_date), isAsc);
        case 'route':
          return compare(+a.route, +b.route, isAsc);
        case 'plate_no':
          return compare(+a.plate_no, +b.plate_no, isAsc);
        case 'driver':
          return compare(a.driver, b.driver, isAsc);
        case 'helper':
          return compare(+a.helper, +b.helper, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
