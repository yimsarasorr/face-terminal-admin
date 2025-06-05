import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFilters } from './components/report-filters';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, ReportFilters],
    template: `
        <div class="grid">
            <!-- Filters Section -->
            <div class="col-12">
                <app-report-filters></app-report-filters>
            </div>
        </div>
    `
})
export class Reports {}
