import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  template: `
    <div class="card">
        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 class="m-0 font-semibold text-xl">{{ title }}</h5>
        </div>
        
        <p-table
            [value]="users"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['name','enrollid']"
            [tableStyle]="{'min-width': '75rem'}"
            [rowHover]="true"
            dataKey="enrollid"
            [(selection)]="selection"
            [rowsPerPageOptions]="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            [showCurrentPageReport]="true"
        >
            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                    </th>
                    <th pSortableColumn="enrollid">ID <p-sortIcon field="enrollid"></p-sortIcon></th>
                    <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="admin">Admin <p-sortIcon field="admin"></p-sortIcon></th>
                    <th pSortableColumn="backupnum">Type <p-sortIcon field="backupnum"></p-sortIcon></th>
                    <th></th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-user>
                <tr>
                    <td>
                        <p-tableCheckbox [value]="user"></p-tableCheckbox>
                    </td>
                    <td>{{ user.enrollid }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.admin === 1 ? 'Yes' : 'No' }}</td>
                    <td>{{ userService.getUserType(user.backupnum) }}</td>
                    <td>
                        <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" 
                            (click)="onEdit.emit(user)"></button>
                        <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                            (click)="onDelete.emit(user)"></button>
                    </td>
                </tr>
            </ng-template>
            <ng-template pTemplate="summary">
                <div class="flex align-items-center justify-content-between">
                    In total there are {{ users ? users.length : 0 }} users.
                </div>
            </ng-template>
        </p-table>
    </div>
  `
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Input() title: string = 'User List';
  @Input() selection: User[] = [];
  
  @Output() selectionChange = new EventEmitter<User[]>();
  @Output() onEdit = new EventEmitter<User>();
  @Output() onDelete = new EventEmitter<User>();
  
  constructor(public userService: UserService) {}
  
  applyFilterGlobal(event: any, stringVal: string) {
    // ฟังก์ชันสำหรับการค้นหาในตาราง
  }
}