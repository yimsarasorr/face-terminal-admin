import { Component, OnInit, Input, inject } from '@angular/core';
import { Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { DialogService } from '../../../services/dialog.service';
import { ReportDetailComponent } from './report-detail.component';
import { VisitorRegistrationComponent } from '../../visitor-registration/visitor-registration.component';

interface ReportType {
  name: string;
  code: string;
}

interface Location {
  name: string;
  code: string;
}

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    MultiSelectModule,
    CardModule
  ],
  template: `
    <div class="card" [ngClass]="{'p-0 border-none': isDialogMode}">
      <div *ngIf="!isDialogMode" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 class="m-0 font-semibold text-xl">Visitor Reports</h5>
        <div class="block mt-3 md:mt-0 ml-auto">
          <div class="flex justify-content-end">
            <button pButton icon="pi pi-user-plus" 
            label="ลงทะเบียนผู้มาติดต่อ" 
            class="p-button-primary mr-2"
            (click)="openVisitorRegistrationDialog()"></button>
            <button pButton icon="pi pi-users" 
              label="กิจกรรมผู้ใช้" 
              class="p-button-outlined p-button-primary"
              (click)="openActivityDialog()"></button>
          </div>
        </div>
      </div>
      
      <div class="grid mt-4">
        <!-- Date Range -->
        <div class="col-12 md:col-4 lg:col-3">
          <span class="p-float-label">
            <p-datepicker [(ngModel)]="dateRange" selectionMode="range" 
              [readonlyInput]="true" [showButtonBar]="true" 
              inputId="daterange" [style]="{'width':'100%'}"
              [maxDate]="today"></p-datepicker>
            <label for="daterange">ช่วงวันที่</label>
          </span>
        </div>
        
        <!-- Report Type -->
        <div class="col-12 md:col-4 lg:col-2">
          <span class="p-float-label">
            <p-select [options]="reportTypes" [(ngModel)]="selectedReportType" 
              placeholder="เลือกประเภท" optionLabel="name" [showClear]="true"
              inputId="reportType" [style]="{'width':'100%'}"></p-select>
            <label for="reportType">ประเภทรายงาน</label>
          </span>
        </div>
        
        <!-- Locations -->
        <div class="col-12 md:col-4 lg:col-3">
          <span class="p-float-label">
            <p-multiSelect [options]="locations" [(ngModel)]="selectedLocations" 
              placeholder="เลือกสถานที่" optionLabel="name" 
              [filter]="true" inputId="locations" 
              [style]="{'width':'100%'}"></p-multiSelect>
            <label for="locations">สถานที่</label>
          </span>
        </div>
        
        <!-- Apply Button -->
        <div class="col-12 lg:col-2 flex align-items-end">
          <button pButton label="แสดงรายงาน" 
            icon="pi pi-search" 
            class="w-full mt-4 md:mt-0" 
            (click)="showReport()"></button>
        </div>
        
        <!-- Reset Button -->
        <div class="col-12 lg:col-2 flex align-items-end">
          <button pButton label="รีเซ็ต" 
            icon="pi pi-refresh" 
            class="p-button-outlined w-full mt-2 md:mt-0" 
            (click)="resetFilters()"></button>
        </div>
      </div>
    </div>
  `
})
export class ReportFilters implements OnInit {
  @Input() isDialogMode: boolean = false;
  @Input() initialFilters: any;

  today: Date = new Date();
  dateRange: Date[] | undefined;
  reportTypes: ReportType[];
  selectedReportType: ReportType | null = null;
  locations: Location[];
  selectedLocations: Location[] = [];

  constructor(private dialogService: DialogService) {
    const today = new Date();
    const prevMonth = new Date();
    prevMonth.setDate(prevMonth.getDate() - 30);
    this.dateRange = [prevMonth, today];
    
    this.reportTypes = [
      { name: 'สรุปผู้เข้าชม', code: 'summary' },
      { name: 'เข้า-ออกอาคาร', code: 'checkinout' },
      { name: 'การใช้อุปกรณ์', code: 'device' },
      { name: 'เหตุการณ์ความปลอดภัย', code: 'security' }
    ];

    this.locations = [
      { name: 'อาคาร A', code: 'bldg-a' },
      { name: 'อาคาร B', code: 'bldg-b' },
      { name: 'อาคาร C', code: 'bldg-c' },
      { name: 'ประตูหลัก', code: 'main-gate' },
      { name: 'ประตูพนักงาน', code: 'staff-gate' },
      { name: 'ประตู VIP', code: 'vip-gate' }
    ];
  }

  ngOnInit() {
    if (this.initialFilters) {
      if (this.initialFilters.dateRange) {
        if (typeof this.initialFilters.dateRange === 'string') {
          try {
            this.dateRange = JSON.parse(this.initialFilters.dateRange);
            if (Array.isArray(this.dateRange)) {
              this.dateRange = this.dateRange.map(d => new Date(d));
            }
          } catch (e) {
            console.error('Invalid date range format', e);
          }
        } else {
          this.dateRange = this.initialFilters.dateRange;
        }
      }
      
      if (this.initialFilters.reportType) {
        this.selectedReportType = this.initialFilters.reportType;
      }
      
      if (this.initialFilters.locations) {
        this.selectedLocations = this.initialFilters.locations;
      }
    }
  }

  openVisitorRegistrationDialog() {
  this.dialogService.open({
    component: 'VisitorRegistration',
    fullscreen: true,
    showHeader: false,
    showFooter: false
    });
  }

  openActivityDialog() {
    if (this.isDialogMode) {
      this.dialogService.open({
        component: 'ActivityReport',
        inputs: {
          initialFilters: {
            dateRange: this.dateRange,
            reportType: this.selectedReportType,
            locations: this.selectedLocations
          },
          isDialogMode: true,
          exportEnabled: true
        },
        title: 'กิจกรรมผู้ใช้งาน',
        fullscreen: true
      });
    } else {
      this.dialogService.openViaUrl('ActivityReport', { 
        title: 'กิจกรรมผู้ใช้งาน',
        dateRange: JSON.stringify(this.dateRange),
        reportType: this.selectedReportType ? JSON.stringify(this.selectedReportType) : null,
        locations: JSON.stringify(this.selectedLocations),
        exportEnabled: 'true',
        fullscreen: 'true'
      });
    }
  }

  showReport() {
    this.dialogService.open({
      component: 'ReportDetailComponent',
      inputs: {
        dateRangeText: this.formatDateRange(),
        reportType: this.selectedReportType,
        locations: this.selectedLocations
      },
      title: 'รายละเอียดรายงาน',
      fullscreen: false,
      width: '60%'
    });
  }

  resetFilters() {
    const today = new Date();
    const prevMonth = new Date();
    prevMonth.setDate(prevMonth.getDate() - 30);
    
    this.dateRange = [prevMonth, today];
    this.selectedReportType = null;
    this.selectedLocations = [];
  }

  formatDateRange(): string {
    if (!this.dateRange || this.dateRange.length < 2) {
      return 'ทุกวัน';
    }
    
    const startDate = this.dateRange[0].toLocaleDateString('th-TH');
    const endDate = this.dateRange[1].toLocaleDateString('th-TH');
    
    return `${startDate} - ${endDate}`;
  }
}