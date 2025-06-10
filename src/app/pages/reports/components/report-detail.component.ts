import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Location {
    name: string;
    code: string;
}

interface ReportType {
    name: string;
    code: string;
}

@Component({
    selector: 'app-report-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="p-fluid">
            <h5>Selected Filters</h5>
            
            <div class="field">
                <label class="font-medium">Date Range:</label>
                <div>{{ dateRangeText }}</div>
            </div>
            
            <div class="field">
                <label class="font-medium">Report Type:</label>
                <div>{{ reportType?.name || 'All Types' }}</div>
            </div>
            
            <div class="field">
                <label class="font-medium">Locations:</label>
                <div *ngIf="!locations || locations.length === 0">All Locations</div>
                <ul *ngIf="locations && locations.length > 0" class="m-0 p-0 list-none">
                    <li *ngFor="let location of locations" class="mb-2">
                        {{ location.name }}
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class ReportDetailComponent {
    @Input() dateRangeText: string = 'All dates';
    @Input() reportType: ReportType | null = null;
    @Input() locations: Location[] = [];
}