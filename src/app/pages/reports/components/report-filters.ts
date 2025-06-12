import { Component, Type, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ReportDetailComponent } from './report-detail.component';
import { ReportDialogComponent } from './report-dialog.component';
import { ActivityReport } from './activity-report';

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
        ChartModule,
        ReportDetailComponent,
        ReportDialogComponent
    ],
    template: `
        <div class="card" [ngClass]="{'p-0 border-none': isDialogMode}">
            <div *ngIf="!isDialogMode" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0 font-semibold text-xl">Visitor Reports</h5>
                <div class="block mt-3 md:mt-0 ml-auto">
                    <div class="flex justify-content-end">
                        <button pButton icon="pi pi-users" 
                            label="User Activity" 
                            class="p-button-outlined p-button-primary"
                            (click)="openActivityDialog()"></button>
                    </div>
                </div>
            </div>
            <app-report-detail style="display:none;"></app-report-detail>
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
        
        <!-- เพิ่ม dialog สำหรับ activity -->
        <app-report-dialog
            [(visible)]="displayActivityDialog"
            [header]="'User Activity'"
            [dialogComponent]="activityComponent"
            [dialogInputs]="activityInputs"
            (visibleChange)="onActivityDialogClose()">
        </app-report-dialog>
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
export class ReportFilters implements OnInit {
    @Input() isDialogMode: boolean = false; // เพิ่ม property นี้
    @Input() initialFilters: any; // เพิ่ม property นี้

    today: Date = new Date();
    currentDate: Date = new Date();
    dateRange: Date[] | undefined;
    reportTypes: ReportType[];
    selectedReportType: ReportType | null = null;
    locations: Location[];
    selectedLocations: Location[] = [];
    displayReportDialog: boolean = false;
    displayActivityDialog: boolean = false;
    
    dialogComponent: Type<any> = ReportDetailComponent;
    dialogInputs: Record<string, unknown> = {};
    activityComponent: Type<any> = ActivityReport;
    activityInputs: Record<string, unknown> = {};

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
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

    ngOnInit() {
        // ตรวจสอบ query params เมื่อ component โหลด
        this.route.queryParams.subscribe(params => {
            if (params['dialog'] === 'activity') {
                this.showUserActivity();
            }
        });
        
        // ตรวจสอบค่าเริ่มต้นจาก initialFilters
        if (this.initialFilters) {
            if (this.initialFilters.dateRange) {
                this.dateRange = this.initialFilters.dateRange;
            }
            // รับค่าอื่นๆ ตามต้องการ
        }
    }
    
    openActivityDialog() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { dialog: 'activity' },
            queryParamsHandling: 'merge'
        });
    }
    
    showUserActivity() {
        this.activityInputs = {
            initialFilters: {
                dateRange: this.dateRange,
                locations: this.selectedLocations,
                reportType: this.selectedReportType
            },
            isDialogMode: true
        };
        
        this.activityComponent = ActivityReport;
        this.displayActivityDialog = true;
    }
    
    onActivityDialogClose() {
        this.displayActivityDialog = false;
        
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { dialog: null },
            queryParamsHandling: 'merge'
        });
    }

    showReport() {
        this.dialogInputs = {
            dateRangeText: this.formatDateRange(),
            reportType: this.selectedReportType,
            locations: this.selectedLocations
        };
        
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