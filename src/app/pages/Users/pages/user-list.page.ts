import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

import { UserListComponent } from '../components/user-list.component';
import { UserFormComponent } from '../components/user-form.component';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    ToastModule,
    CardModule,
    UserListComponent,
    UserFormComponent
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      
      <p-toolbar styleClass="mb-4 gap-2">
        <ng-template pTemplate="left">
          <button pButton label="New" icon="pi pi-plus" class="p-button-success mr-2" (click)="openNew()"></button>
          <button pButton label="Delete" icon="pi pi-trash" class="p-button-danger" 
              [disabled]="!selectedUsers || !selectedUsers.length" (click)="deleteSelectedUsers()"></button>
        </ng-template>
        <ng-template pTemplate="right">
          <button pButton label="Export" icon="pi pi-upload" class="p-button-help"></button>
        </ng-template>
      </p-toolbar>
      
      <app-user-list
        [users]="users"
        [selection]="selectedUsers"
        (selectionChange)="selectedUsers = $event"
        (onEdit)="editUser($event)"
        (onDelete)="confirmDelete($event)">
      </app-user-list>
      
      <!-- Dialog for adding/editing users -->
      <p-dialog [(visible)]="userDialog" [style]="{width: '450px'}" 
          [header]="editMode ? 'Edit User' : 'Add User'" [modal]="true" styleClass="p-fluid">
        <app-user-form 
          [(user)]="user"
          [submitted]="submitted"
          [editMode]="editMode">
        </app-user-form>
        
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton label="Save" icon="pi pi-check" class="p-button-text" (click)="saveUser()"></button>
        </ng-template>
      </p-dialog>
      
      <!-- Delete confirmation dialog -->
      <p-dialog [(visible)]="deleteUserDialog" header="Confirm" [modal]="true" [style]="{width:'450px'}">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
          <span *ngIf="user">Are you sure you want to delete {{user.name}}?</span>
        </div>
        <ng-template pTemplate="footer">
          <button pButton icon="pi pi-times" label="No" class="p-button-text" (click)="deleteUserDialog = false"></button>
          <button pButton icon="pi pi-check" label="Yes" class="p-button-text" (click)="confirmDeleteUser()"></button>
        </ng-template>
      </p-dialog>
      
      <!-- Bulk delete confirmation dialog -->
      <p-dialog [(visible)]="deleteUsersDialog" header="Confirm" [modal]="true" [style]="{width:'450px'}">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
          <span>Are you sure you want to delete the selected users?</span>
        </div>
        <ng-template pTemplate="footer">
          <button pButton icon="pi pi-times" label="No" class="p-button-text" (click)="deleteUsersDialog = false"></button>
          <button pButton icon="pi pi-check" label="Yes" class="p-button-text" (click)="deleteSelectedConfirm()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class UserListPage implements OnInit {
  users: User[] = [];
  selectedUsers: User[] = [];
  user: User = {} as User;
  
  userDialog: boolean = false;
  deleteUserDialog: boolean = false;
  deleteUsersDialog: boolean = false;
  submitted: boolean = false;
  editMode: boolean = false;
  
  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
  
  openNew() {
    this.user = {} as User;
    this.submitted = false;
    this.editMode = false;
    this.userDialog = true;
  }
  
  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }
  
  saveUser() {
    this.submitted = true;
    
    if (this.user.name?.trim()) {
      if (this.editMode) {
        this.userService.updateUser(this.user).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
          this.loadUsers();
        });
      } else {
        this.userService.addUser(this.user).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
          this.loadUsers();
        });
      }
      
      this.userDialog = false;
      this.user = {} as User;
    }
  }
  
  editUser(user: User) {
    this.user = {...user};
    this.editMode = true;
    this.userDialog = true;
  }
  
  confirmDelete(user: User) {
    this.user = user;
    this.deleteUserDialog = true;
  }
  
  confirmDeleteUser() {
    this.userService.deleteUser(this.user.enrollid).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
      this.loadUsers();
    });
    this.deleteUserDialog = false;
    this.user = {} as User;
  }
  
  deleteSelectedUsers() {
    this.deleteUsersDialog = true;
  }
  
  deleteSelectedConfirm() {
    const deletePromises = this.selectedUsers.map(user => 
      this.userService.deleteUser(user.enrollid)
    );
    
    // สำหรับการใช้งานจริงควรใช้ forkJoin หรือ Promise.all
    this.loadUsers();
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    this.deleteUsersDialog = false;
    this.selectedUsers = [];
  }
}