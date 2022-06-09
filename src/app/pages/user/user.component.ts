import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, of as observableOf } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { findIndex } from 'lodash';

import { ModalComponent } from 'src/app/components/modal/modal.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'is_disabled', 'created_by', 'created_at', 'updated_by', 'updated_at', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  userList: any = [];
  users: any = new MatTableDataSource<any>(this.userList);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _userService: UserService,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this.users.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this._userService.getUsers({
            sort: this.sort.active,
            order: this.sort.direction,
            page: this.paginator.pageIndex + 1,
            perPage: this.paginator.pageSize
          }).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.meta.total;
          return data.data;
        }),
      )
      .subscribe(data => {
        this.userList = data;
        this.users = new MatTableDataSource<any>(this.userList);
      });
  }

  searchUser(evt: any) {
    this.isLoadingResults = true;
    this._userService
      .getUsers({
        sort: this.sort.active,
        order: this.sort.direction,
        page: this.paginator.pageIndex + 1,
        perPage: this.paginator.pageSize,
        search: evt.target.value
      })
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        catchError(() => observableOf(null))
      )
      .subscribe(({ data, meta }) => {
        this.userList = data;
        this.users = new MatTableDataSource<any>(this.userList);
        this.isLoadingResults = false;
        this.resultsLength = meta.total;
      });
  }

  remove(index: any) {
    this.userList.splice(index, 1);
    this.users = new MatTableDataSource<any>(this.userList);
  }

  add(data: any) {
    this.userList.push(data);
    this.users = new MatTableDataSource<any>(this.userList);
  }

  edit(index: number, data: any) {
    this.userList[index] = data;
    this.users = new MatTableDataSource<any>(this.userList);
  }

  openDialog(action: string, row: any = {}) {
    let dialogRef = this._dialog.open(ModalComponent, {
      data: { action, row, originalform: this.users, entity: 'user' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return false;
      }

      const { action, data } = result;
      if (action === 'create') {
        data && this.add(data.user);
        return false;
      }

      const index = findIndex(this.userList, (user: any) => user.id === data.id);
      this.edit(index, data);
      return false;
    });
  }

}
