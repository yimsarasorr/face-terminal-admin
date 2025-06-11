import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ReportDetailComponent } from './report-detail.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReportDialogComponent } from './report-dialog.component';

interface UserActivity {
    id: number;
    username: string;
    action: string;
    timestamp: Date;
    details: string;
    status: string;
}

interface ActivityFilter {
    action: string;
    status: string;
}

interface Location {
    name: string;
    code: string;
}

interface ReportType {
    name: string;
    code: string;
}

@Component({
    selector: 'app-activity-report',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        DialogModule,
        CardModule,
        MultiSelectModule,
        ReportDetailComponent,
        ReportDialogComponent
    ],
    template: `
        <div class="card">
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0 font-semibold text-xl">User Activity Log</h5>
                <div class="flex gap-2 mt-3 md:mt-0 ml-auto">
                    <button pButton icon="pi pi-filter" label="Show Filters" 
                        (click)="showFilters()" 
                        class="p-button-outlined"></button>
                    <button pButton icon="pi pi-search" label="View Report" 
                        (click)="showReport()" 
                        class="p-button-primary"></button>
                </div>
            </div>
            
            <div class="mt-3" *ngIf="filtersVisible">
                <div class="p-card p-3">
                    <div class="grid">
                        <!-- Date Range Filter -->
                        <div class="col-12 md:col-6 lg:col-3 mb-3">
                            <label for="daterange" class="block mb-2">Date Range</label>
                            <p-calendar [(ngModel)]="dateRange" selectionMode="range" 
                                [readonlyInput]="true" [showButtonBar]="true" 
                                inputId="daterange" [style]="{'width':'100%'}"
                                [maxDate]="today"></p-calendar>
                        </div>
                        
                        <!-- User Filter -->
                        <div class="col-12 md:col-6 lg:col-3 mb-3">
                            <label for="username" class="block mb-2">Username</label>
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-user"></i>
                                <input type="text" pInputText [(ngModel)]="usernameFilter" 
                                    placeholder="Filter by username" style="width:100%">
                            </span>
                        </div>
                        
                        <!-- Action Filter -->
                        <div class="col-12 md:col-6 lg:col-3 mb-3">
                            <label for="action" class="block mb-2">Action Type</label>
                            <p-dropdown [options]="actionTypes" [(ngModel)]="selectedAction" 
                                placeholder="All Actions" optionLabel="name" [showClear]="true"
                                inputId="action" [style]="{'width':'100%'}"></p-dropdown>
                        </div>
                        
                        <!-- Status Filter -->
                        <div class="col-12 md:col-6 lg:col-3 mb-3">
                            <label for="status" class="block mb-2">Status</label>
                            <p-dropdown [options]="statusTypes" [(ngModel)]="selectedStatus" 
                                placeholder="All Statuses" optionLabel="name" [showClear]="true"
                                inputId="status" [style]="{'width':'100%'}"></p-dropdown>
                        </div>
                    </div>
                    
                    <div class="flex justify-content-end mt-3">
                        <button pButton label="Apply Filters" icon="pi pi-filter" 
                            (click)="applyFilters()" 
                            class="mr-2"></button>
                        <button pButton label="Reset" icon="pi pi-refresh" 
                            (click)="resetFilters()" 
                            class="p-button-outlined"></button>
                    </div>
                </div>
            </div>

            <app-report-detail style="display:none;"></app-report-detail>
            
            <!-- Activity Table -->
            <div class="mt-4">
                <p-table [value]="filteredActivities" [paginator]="true" [rows]="10" 
                    [rowsPerPageOptions]="[5,10,25,50]" [showCurrentPageReport]="true" 
                    responsiveLayout="scroll"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    styleClass="p-datatable-sm p-datatable-striped">
                    <ng-template pTemplate="header">
                        <tr>
                            <th pSortableColumn="timestamp">Time <p-sortIcon field="timestamp"></p-sortIcon></th>
                            <th pSortableColumn="username">User <p-sortIcon field="username"></p-sortIcon></th>
                            <th pSortableColumn="action">Action <p-sortIcon field="action"></p-sortIcon></th>
                            <th>Details</th>
                            <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-activity>
                        <tr>
                            <td>{{ activity.timestamp | date:'short' }}</td>
                            <td>{{ activity.username }}</td>
                            <td>{{ activity.action }}</td>
                            <td>{{ activity.details }}</td>
                            <td>
                                <span [ngClass]="{
                                    'bg-green-100 text-green-700 p-1 px-2 rounded-md': activity.status === 'Success',
                                    'bg-red-100 text-red-700 p-1 px-2 rounded-md': activity.status === 'Failed',
                                    'bg-yellow-100 text-yellow-700 p-1 px-2 rounded-md': activity.status === 'Warning',
                                    'bg-blue-100 text-blue-700 p-1 px-2 rounded-md': activity.status === 'Info'
                                }">{{ activity.status }}</span>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
        
        <app-report-dialog
            [(visible)]="displayReportDialog"
            [header]="'Activity Report Summary'"
            [dialogComponent]="dialogComponent"
            [dialogInputs]="dialogInputs">
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
    `]
})
export class ActivityReport {
    today: Date = new Date();
    dateRange: Date[] | undefined;
    usernameFilter: string = '';
    filtersVisible: boolean = false;
    displayReportDialog: boolean = false;
    
    activities: UserActivity[] = [];
    filteredActivities: UserActivity[] = [];
    
    actionTypes = [
        { name: 'Login', value: 'Login' },
        { name: 'Logout', value: 'Logout' },
        { name: 'Create', value: 'Create' },
        { name: 'Update', value: 'Update' },
        { name: 'Delete', value: 'Delete' },
        { name: 'View', value: 'View' }
    ];
    
    statusTypes = [
        { name: 'Success', value: 'Success' },
        { name: 'Failed', value: 'Failed' },
        { name: 'Warning', value: 'Warning' },
        { name: 'Info', value: 'Info' }
    ];
    
    selectedAction: any = null;
    selectedStatus: any = null;
    
    dialogComponent: Type<any> = ReportDetailComponent;
    dialogInputs: { 
        dateRangeText: string; 
        reportType: ReportType; 
        locations: Location[]; 
    } = {
        dateRangeText: '',
        reportType: { name: '', code: '' },
        locations: []
    };

    constructor() {
        const today = new Date();
        const prevWeek = new Date();
        prevWeek.setDate(prevWeek.getDate() - 7);
        this.dateRange = [prevWeek, today];
        this.generateSampleData();
        this.applyFilters();
    }
    
    generateSampleData() {
        const users = ['admin', 'john', 'sarah', 'david', 'emma'];
        const actions = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'View'];
        const statuses = ['Success', 'Failed', 'Warning', 'Info'];
        const details = [
            'User dashboard accessed',
            'Password changed',
            'New user created',
            'Profile updated',
            'File uploaded',
            'Settings modified',
            'Report generated',
            'Record deleted'
        ];
        
        this.activities = [];
        
        // สร้าง 50 รายการตัวอย่าง
        for (let i = 1; i <= 50; i++) {
            const now = new Date();
            // สุ่มเวลาในช่วง 14 วันที่ผ่านมา
            const randomDate = new Date(
                now.getTime() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)
            );
            
            this.activities.push({
                id: i,
                username: users[Math.floor(Math.random() * users.length)],
                action: actions[Math.floor(Math.random() * actions.length)],
                timestamp: randomDate,
                details: details[Math.floor(Math.random() * details.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)]
            });
        }
        
        // เรียงตามเวลาล่าสุดก่อน
        this.activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    
    // แสดง/ซ่อนแผงตัวกรอง
    showFilters() {
        this.filtersVisible = !this.filtersVisible;
    }
    
    // นำตัวกรองมาใช้กับข้อมูล
    applyFilters() {
        this.filteredActivities = [...this.activities];
        
        // กรองตามวันที่
        if (this.dateRange && this.dateRange.length === 2) {
            const startDate = new Date(this.dateRange[0]);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(this.dateRange[1]);
            endDate.setHours(23, 59, 59, 999);
            
            this.filteredActivities = this.filteredActivities.filter(item => {
                const itemDate = new Date(item.timestamp);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
        
        // กรองตามชื่อผู้ใช้
        if (this.usernameFilter) {
            this.filteredActivities = this.filteredActivities.filter(item =>
                item.username.toLowerCase().includes(this.usernameFilter.toLowerCase())
            );
        }
        
        // กรองตามประเภทการกระทำ
        if (this.selectedAction) {
            this.filteredActivities = this.filteredActivities.filter(item =>
                item.action === this.selectedAction.value
            );
        }
        
        // กรองตามสถานะ
        if (this.selectedStatus) {
            this.filteredActivities = this.filteredActivities.filter(item =>
                item.status === this.selectedStatus.value
            );
        }
    }
    
    // รีเซ็ตตัวกรอง
    resetFilters() {
        const today = new Date();
        const prevWeek = new Date();
        prevWeek.setDate(prevWeek.getDate() - 7);
        
        this.dateRange = [prevWeek, today];
        this.usernameFilter = '';
        this.selectedAction = null;
        this.selectedStatus = null;
        
        this.filteredActivities = [...this.activities];
    }
    
    // แสดงรายงานในหน้าต่าง Dialog
    showReport() {
        // สร้าง object ใหม่แทนการแก้ไข property
        this.dialogInputs = {
            dateRangeText: this.formatDateRange(),
            reportType: {
                name: 'User Activity Log',
                code: 'activity'
            },
            locations: []
        };
        
        // สร้าง locations array ใหม่ตามเงื่อนไข
        const locations: Location[] = [];
        
        if (this.selectedAction) {
            locations.push({ 
                name: `Action: ${this.selectedAction.name}`, 
                code: this.selectedAction.value 
            });
        }
        
        if (this.selectedStatus) {
            locations.push({ 
                name: `Status: ${this.selectedStatus.name}`, 
                code: this.selectedStatus.value 
            });
        }
        
        if (this.usernameFilter) {
            locations.push({ 
                name: `Username: ${this.usernameFilter}`, 
                code: 'username' 
            });
        }
        
        // กำหนดค่า locations หลังจากสร้างเสร็จ
        this.dialogInputs.locations = locations;
        
        this.displayReportDialog = true;
    }
    
    // ฟอร์แมตช่วงวันที่เป็นข้อความ
    formatDateRange(): string {
        if (!this.dateRange || this.dateRange.length < 2) {
            return 'All dates';
        }
        
        const startDate = this.dateRange[0].toLocaleDateString();
        const endDate = this.dateRange[1].toLocaleDateString();
        
        return `${startDate} - ${endDate}`;
    }
}