import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class UsersComponent {}