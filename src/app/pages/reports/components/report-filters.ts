import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

interface ReportType {
    name: string;
    code: string;
}

interface Location {
    name: string;
    code: string;
}

interface VisitorData {
    id: number;
    name: string;
    checkIn: string;
    checkOut: string;
    location: string;
    purpose: string;
    host: string;
}

@Component({
    selector: 'app-report-filters',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        DropdownModule,
        ButtonModule,
        MultiSelectModule,
        CardModule,
        DialogModule,
        TableModule,
        ChartModule
    ],
    template: `
        <!-- Card ฟิลเตอร์ -->
        <div class="card">
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0 font-semibold text-xl">Visitor Reports</h5>
                <span class="block mt-3 md:mt-0 p-input-icon-left">
                    <div class="flex gap-2 flex-wrap">
                        <button pButton icon="pi pi-file-excel" 
                            label="Export Excel" 
                            class="p-button-outlined p-button-success"></button>
                        <button pButton icon="pi pi-file-pdf" 
                            label="Export PDF" 
                            class="p-button-outlined p-button-danger"></button>
                    </div>
                </span>
            </div>
            
            <div class="grid mt-4">
                <!-- Date Range -->
                <div class="col-12 md:col-4 lg:col-3">
                    <span class="p-float-label">
                        <p-calendar [(ngModel)]="dateRange" selectionMode="range" 
                            [readonlyInput]="true" [showButtonBar]="true" 
                            inputId="daterange" [style]="{'width':'100%'}"
                            [maxDate]="today"></p-calendar>
                        <label for="daterange">Date Range</label>
                    </span>
                </div>
                
                <!-- Report Type -->
                <div class="col-12 md:col-4 lg:col-2">
                    <span class="p-float-label">
                        <p-dropdown [options]="reportTypes" [(ngModel)]="selectedReportType" 
                            placeholder="Select Type" optionLabel="name" [showClear]="true"
                            inputId="reportType" [style]="{'width':'100%'}"></p-dropdown>
                        <label for="reportType">Report Type</label>
                    </span>
                </div>
                
                <!-- Locations -->
                <div class="col-12 md:col-4 lg:col-3">
                    <span class="p-float-label">
                        <p-multiSelect [options]="locations" [(ngModel)]="selectedLocations" 
                            placeholder="Select Locations" optionLabel="name" 
                            [filter]="true" inputId="locations" 
                            [style]="{'width':'100%'}"></p-multiSelect>
                        <label for="locations">Locations</label>
                    </span>
                </div>
                
                <!-- Apply Button -->
                <div class="col-12 lg:col-2 flex align-items-end">
                    <button pButton label="Apply Filters" 
                        icon="pi pi-search" 
                        class="w-full mt-4 md:mt-0" 
                        (click)="showReport()"></button>
                </div>
                
                <!-- Reset Button -->
                <div class="col-12 lg:col-2 flex align-items-end">
                    <button pButton label="Reset" 
                        icon="pi pi-refresh" 
                        class="p-button-outlined w-full mt-2 md:mt-0" 
                        (click)="resetFilters()"></button>
                </div>
            </div>
        </div>
        
        <!-- Dialog แสดงผล filter แบบเต็มหน้าจอ -->
        <p-dialog 
            [(visible)]="displayReportDialog" 
            [modal]="true" 
            [style]="{width: '100vw', height: '100vh'}" 
            [contentStyle]="{height: 'calc(100vh - 145px)', overflow: 'auto'}" 
            [baseZIndex]="10000"
            [showHeader]="true"
            [draggable]="false"
            [resizable]="false"
            [closable]="true"
            styleClass="fullscreen-dialog"
            header="Filter Summary">
            
            <div class="p-fluid">
                <h5>Selected Filters</h5>
                
                <div class="field">
                    <label class="font-medium">Date Range:</label>
                    <div>{{ formatDateRange() }}</div>
                </div>
                
                <div class="field">
                    <label class="font-medium">Report Type:</label>
                    <div>{{ selectedReportType?.name || 'All Types' }}</div>
                </div>
                
                <div class="field">
                    <label class="font-medium">Locations:</label>
                    <div *ngIf="selectedLocations.length === 0">All Locations</div>
                    <ul *ngIf="selectedLocations.length > 0" class="m-0 p-0 list-none">
                        <li *ngFor="let location of selectedLocations" class="mb-2">
                            {{ location.name }}
                        </li>
                    </ul>
                </div>
            </div>
            
            <ng-template pTemplate="footer">
                <button pButton label="Close" icon="pi pi-times" 
                    (click)="displayReportDialog = false" 
                    class="p-button-text"></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        :host ::ng-deep .fullscreen-dialog {
            margin: 0 !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
        }
        
        :host ::ng-deep .fullscreen-dialog .p-dialog-content {
            padding: 1.5rem;
        }
        
        :host ::ng-deep .fullscreen-dialog .p-dialog-header {
            padding-top: 1rem;
        }
        
        :host ::ng-deep .fullscreen-dialog .p-dialog-footer {
            padding: 1rem 1.5rem;
        }
    `]
})
export class ReportFilters {
    today: Date = new Date();
    currentDate: Date = new Date();
    dateRange: Date[] | undefined;
    reportTypes: ReportType[];
    selectedReportType: ReportType | null = null;
    locations: Location[];
    selectedLocations: Location[] = [];
    displayReportDialog: boolean = false;

    constructor() {
        const today = new Date();
        const prevMonth = new Date();
        prevMonth.setDate(prevMonth.getDate() - 30);
        this.dateRange = [prevMonth, today];
        this.reportTypes = [
            { name: 'Visitor Summary', code: 'summary' },
            { name: 'Check-In/Out', code: 'checkinout' },
            { name: 'Device Usage', code: 'device' },
            { name: 'Security Events', code: 'security' }
        ];

        this.locations = [
            { name: 'Building A', code: 'bldg-a' },
            { name: 'Building B', code: 'bldg-b' },
            { name: 'Building C', code: 'bldg-c' },
            { name: 'Main Entrance', code: 'main-gate' },
            { name: 'Staff Entrance', code: 'staff-gate' },
            { name: 'VIP Gate', code: 'vip-gate' }
        ];
    }

    showReport() {
        this.displayReportDialog = true;
    }

    resetFilters() {
        const today = new Date();
        const prevMonth = new Date();
        prevMonth.setDate(prevMonth.getDate() - 30);
        
        this.dateRange = [prevMonth, today];
        this.selectedReportType = null;
        this.selectedLocations = [];

        console.log('Filters reset');
    }

    formatDateRange(): string {
        if (!this.dateRange || this.dateRange.length < 2) {
            return 'All dates';
        }
        
        const startDate = this.dateRange[0].toLocaleDateString();
        const endDate = this.dateRange[1].toLocaleDateString();
        
        return `${startDate} - ${endDate}`;
    }
}