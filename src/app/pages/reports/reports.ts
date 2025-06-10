import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="grid">
            <!-- Content Section -->
            <div class="col-12">
                <router-outlet></router-outlet>
            </div>
        </div>
    `
})
export class Reports {}
