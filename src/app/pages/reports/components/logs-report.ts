import { Component, Type } from '@angular/core';
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
import { SliderModule } from 'primeng/slider'; // เพิ่มมาใหม่
import { InputSwitchModule } from 'primeng/inputswitch'; // เพิ่มมาใหม่
import { ReportDetailComponent } from './report-detail.component';

interface LogLevel {
    name: string;
    code: string;
    severity: number;
}

@Component({
    selector: 'app-logs-report',
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
        SliderModule,
        InputSwitchModule,
        ReportDetailComponent
    ],
    template: `
        <div class="card">
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0 font-semibold text-xl">System Logs Report</h5>
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
                
                <!-- Log Level -->
                <div class="col-12 md:col-4 lg:col-2">
                    <span class="p-float-label">
                        <p-dropdown [options]="logLevels" [(ngModel)]="selectedLogLevel" 
                            placeholder="Select Level" optionLabel="name" [showClear]="true"
                            inputId="logLevel" [style]="{'width':'100%'}"></p-dropdown>
                        <label for="logLevel">Log Level</label>
                    </span>
                </div>
                
                <!-- Include System Logs -->
                <div class="col-12 md:col-4 lg:col-2 flex flex-column justify-content-center">
                    <div class="field-checkbox mt-3">
                        <p-inputSwitch [(ngModel)]="includeSystemLogs" inputId="systemLogs"></p-inputSwitch>
                        <label for="systemLogs" class="ml-2">Include System Logs</label>
                    </div>
                </div>
                
                <!-- Min Entries -->
                <div class="col-12 md:col-6 lg:col-3">
                    <label for="minEntries" class="mb-2 block">Min Entries: {{minEntries}}</label>
                    <p-slider [(ngModel)]="minEntries" [min]="0" [max]="1000" [style]="{'width':'100%'}"></p-slider>
                </div>
                
                <!-- Apply Button -->
                <div class="col-12 lg:col-1 flex align-items-end">
                    <button pButton label="Apply" 
                        icon="pi pi-search" 
                        class="w-full mt-4 md:mt-0" 
                        (click)="showReport()"></button>
                </div>
                
                <!-- Reset Button -->
                <div class="col-12 lg:col-1 flex align-items-end">
                    <button pButton label="Reset" 
                        icon="pi pi-refresh" 
                        class="p-button-outlined w-full mt-2 md:mt-0" 
                        (click)="resetFilters()"></button>
                </div>
            </div>
        </div>
        
        <app-report-detail style="display:none;"></app-report-detail>
        
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
            header="System Logs Analysis">
            
            <ng-container *ngComponentOutlet="dialogComponent; inputs: dialogInputs"></ng-container>
            
            <ng-template pTemplate="footer">
                <button pButton label="Close" icon="pi pi-times" 
                    (click)="displayReportDialog = false" 
                    class="p-button-text"></button>
                <button pButton label="Download Full Logs" icon="pi pi-download" 
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
export class LogsReport {
    today: Date = new Date();
    dateRange: Date[] | undefined;
    logLevels: LogLevel[];
    selectedLogLevel: LogLevel | null = null;
    includeSystemLogs: boolean = true;
    minEntries: number = 100;
    displayReportDialog: boolean = false;
    
    dialogComponent: Type<any> = ReportDetailComponent;
    dialogInputs: Record<string, unknown> = {};

    constructor() {
        const today = new Date();
        const prevWeek = new Date();
        prevWeek.setDate(prevWeek.getDate() - 7); // เริ่มจาก 7 วันย้อนหลัง (แตกต่างจากอันอื่น)
        this.dateRange = [prevWeek, today];
        
        this.logLevels = [
            { name: 'Error', code: 'error', severity: 1 },
            { name: 'Warning', code: 'warning', severity: 2 },
            { name: 'Info', code: 'info', severity: 3 },
            { name: 'Debug', code: 'debug', severity: 4 }
        ];
    }

    showReport() {
        // สังเกตว่าเราใช้ ReportDetailComponent เดียวกันแต่ส่งพารามิเตอร์ที่แตกต่างกัน
        // และมีรูปแบบข้อมูลเฉพาะสำหรับ log report
        this.dialogInputs = {
            dateRangeText: this.formatDateRange(),
            reportType: {
                name: 'System Logs: ' + (this.selectedLogLevel?.name || 'All Levels'),
                code: 'logs',
                severity: this.selectedLogLevel?.severity || 0
            },
            locations: [
                { 
                    name: `System Logs: ${this.includeSystemLogs ? 'Included' : 'Excluded'}`,
                    code: 'system'
                },
                { 
                    name: `Min Entries: ${this.minEntries}`,
                    code: 'min-entries'
                }
            ],
            // เพิ่มข้อมูลพิเศษสำหรับ log report
            additionalInfo: {
                minEntries: this.minEntries,
                includeSystemLogs: this.includeSystemLogs
            }
        };
        
        this.displayReportDialog = true;
    }

    resetFilters() {
        const today = new Date();
        const prevWeek = new Date();
        prevWeek.setDate(prevWeek.getDate() - 7);
        
        this.dateRange = [prevWeek, today];
        this.selectedLogLevel = null;
        this.includeSystemLogs = true;
        this.minEntries = 100;

        console.log('Log filters reset');
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