import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule
  ],
  template: `
    <div class="p-fluid">
      <div class="field">
        <label for="name">Name</label>
        <input type="text" pInputText id="name" [(ngModel)]="user.name" required autofocus />
        <small class="p-error" *ngIf="submitted && !user.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="enrollid">ID</label>
        <input type="number" pInputText id="enrollid" [(ngModel)]="user.enrollid" 
          [disabled]="editMode" required />
        <small class="p-error" *ngIf="submitted && !user.enrollid">ID is required.</small>
      </div>
      <div class="field-checkbox">
        <p-checkbox [(ngModel)]="user.admin" [binary]="true" inputId="admin"></p-checkbox>
        <label for="admin">Admin</label>
      </div>
    </div>
  `
})
export class UserFormComponent {
  @Input() user: User = {} as User;
  @Input() submitted: boolean = false;
  @Input() editMode: boolean = false;
  
  @Output() userChange = new EventEmitter<User>();
}