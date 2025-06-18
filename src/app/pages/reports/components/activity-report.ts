import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogService } from '../../../services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';

interface UserActivity {
  id: number;
  username: string;
  action: string;
  timestamp: Date;
  details: string;
  status: string;
}

@Component({
  selector: 'app-activity-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    CardModule
  ],
  template: `
    <div class="card" [ngClass]="{'p-0 border-none': isDialogMode}">
      <div *ngIf="!isDialogMode" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 class="m-0 font-semibold text-xl">บันทึกกิจกรรมผู้ใช้</h5>
        <div class="flex gap-2 mt-3 md:mt-0 ml-auto">
          <button pButton icon="pi pi-chart-line" label="รายงานผู้เข้าชม" 
            (click)="openVisitorDialog()" 
            class="p-button-outlined p-button-help"></button>
          <button pButton icon="pi pi-filter" label="แสดงตัวกรอง" 
            (click)="showFilters()" 
            class="p-button-outlined"></button>
        </div>
      </div>
      
      <div class="mt-3" *ngIf="filtersVisible">
        <div class="p-card p-3">
          <div class="grid">
            <!-- Date Range Filter -->
            <div class="col-12 md:col-6 lg:col-3 mb-3">
              <label for="daterange" class="block mb-2">ช่วงวันที่</label>
              <p-datepicker [(ngModel)]="dateRange" selectionMode="range" 
                [readonlyInput]="true" [showButtonBar]="true" 
                inputId="daterange" [style]="{'width':'100%'}"
                [maxDate]="today"></p-datepicker>
            </div>
            
            <!-- User Filter -->
            <div class="col-12 md:col-6 lg:col-3 mb-3">
              <label for="username" class="block mb-2">ชื่อผู้ใช้</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-user"></i>
                <input type="text" pInputText [(ngModel)]="usernameFilter" 
                  placeholder="กรองตามชื่อผู้ใช้" style="width:100%">
              </span>
            </div>
            
            <!-- Action Filter -->
            <div class="col-12 md:col-6 lg:col-3 mb-3">
              <label for="action" class="block mb-2">ประเภทกิจกรรม</label>
              <p-select [options]="actionTypes" [(ngModel)]="selectedAction" 
                placeholder="ทุกกิจกรรม" optionLabel="name" [showClear]="true"
                inputId="action" [style]="{'width':'100%'}"></p-select>
            </div>
            
            <!-- Status Filter -->
            <div class="col-12 md:col-6 lg:col-3 mb-3">
              <label for="status" class="block mb-2">สถานะ</label>
              <p-select [options]="statusTypes" [(ngModel)]="selectedStatus" 
                placeholder="ทุกสถานะ" optionLabel="name" [showClear]="true"
                inputId="status" [style]="{'width':'100%'}"></p-select>
            </div>
          </div>
          
          <div class="flex justify-content-end mt-3">
            <button pButton label="ใช้ตัวกรอง" icon="pi pi-filter" 
              (click)="applyFilters()" 
              class="mr-2"></button>
            <button pButton label="รีเซ็ต" icon="pi pi-refresh" 
              (click)="resetFilters()" 
              class="p-button-outlined"></button>
          </div>
        </div>
      </div>
      
      <div class="mt-4">
        <p-table [value]="filteredActivities" [paginator]="true" [rows]="10" 
          [rowsPerPageOptions]="[5,10,25,50]" [showCurrentPageReport]="true" 
          currentPageReportTemplate="แสดง {first} ถึง {last} จากทั้งหมด {totalRecords} รายการ"
          styleClass="p-datatable-sm p-datatable-striped">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="timestamp">เวลา <p-sortIcon field="timestamp"></p-sortIcon></th>
              <th pSortableColumn="username">ผู้ใช้ <p-sortIcon field="username"></p-sortIcon></th>
              <th pSortableColumn="action">กิจกรรม <p-sortIcon field="action"></p-sortIcon></th>
              <th>รายละเอียด</th>
              <th pSortableColumn="status">สถานะ <p-sortIcon field="status"></p-sortIcon></th>
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
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center p-4">
                ไม่พบข้อมูลกิจกรรม
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class ActivityReport implements OnChanges, OnInit {
  @Input() initialFilters: any;
  @Input() isDialogMode: boolean = false;
  @Input() exportEnabled: boolean = false;
  
  today: Date = new Date();
  dateRange: Date[] | undefined;
  usernameFilter: string = '';
  filtersVisible: boolean = false;
  
  activities: UserActivity[] = [];
  filteredActivities: UserActivity[] = [];
  
  actionTypes = [
    { name: 'เข้าสู่ระบบ', value: 'Login' },
    { name: 'ออกจากระบบ', value: 'Logout' },
    { name: 'สร้าง', value: 'Create' },
    { name: 'แก้ไข', value: 'Update' },
    { name: 'ลบ', value: 'Delete' },
    { name: 'ดู', value: 'View' }
  ];
  
  statusTypes = [
    { name: 'สำเร็จ', value: 'Success' },
    { name: 'ล้มเหลว', value: 'Failed' },
    { name: 'เตือน', value: 'Warning' },
    { name: 'ข้อมูล', value: 'Info' }
  ];
  
  selectedAction: any = null;
  selectedStatus: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {
    const today = new Date();
    const prevWeek = new Date();
    prevWeek.setDate(prevWeek.getDate() - 7);
    this.dateRange = [prevWeek, today];
    
    // สร้างข้อมูลตัวอย่าง
    this.generateSampleData();
    this.filteredActivities = [...this.activities];
    
    // ตรวจสอบ query params
    this.route.queryParams.subscribe(params => {
      if (params['dialog'] === 'visitor') {
        this.openVisitorDialog();
      }
    });
  }
  
  ngOnInit() {
    // ใช้ initialFilters ถ้ามี
    if (this.initialFilters) {
      if (this.initialFilters.dateRange) {
        this.dateRange = this.initialFilters.dateRange;
      }
      
      if (this.initialFilters.reportType) {
        this.selectedAction = {
          name: this.initialFilters.reportType.name,
          value: this.initialFilters.reportType.code
        };
      }
      
      if (this.initialFilters.locations && this.initialFilters.locations.length > 0) {
        const locationNames = this.initialFilters.locations.map((loc: any) => loc.name);
        if (locationNames.length > 0) {
          this.usernameFilter = locationNames.join(', ');
        }
      }
      
      this.applyFilters();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialFilters'] && changes['initialFilters'].currentValue) {
      this.ngOnInit();
    }
  }
  
  generateSampleData() {
    // สร้างข้อมูลจำลอง
    this.activities = Array.from({ length: 50 }, (_, i) => {
      const now = new Date();
      const randomHours = Math.floor(Math.random() * 168); // สุ่มภายใน 1 สัปดาห์
      const timestamp = new Date(now.getTime() - randomHours * 60 * 60 * 1000);
      
      const users = ['admin', 'user1', 'manager', 'supervisor', 'guest'];
      const actions = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'View'];
      const details = [
        'เข้าถึงหน้าแดชบอร์ด', 
        'ปรับปรุงข้อมูลผู้ใช้', 
        'เรียกดูรายงาน', 
        'สร้างบัญชีผู้ใช้', 
        'ลบข้อมูลการเข้าชม',
        'แก้ไขการตั้งค่า'
      ];
      const statuses = ['Success', 'Failed', 'Warning', 'Info'];
      
      return {
        id: i + 1,
        username: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp,
        details: details[Math.floor(Math.random() * details.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };
    });
  }
  
  showFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
  
  applyFilters() {
    let filtered = [...this.activities];
    
    // กรองตามช่วงวันที่
    if (this.dateRange && this.dateRange.length === 2) {
      const startDate = new Date(this.dateRange[0]);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(this.dateRange[1]);
      endDate.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }
    
    // กรองตามชื่อผู้ใช้
    if (this.usernameFilter) {
      const filterValue = this.usernameFilter.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.username.toLowerCase().includes(filterValue)
      );
    }
    
    // กรองตามประเภทกิจกรรม
    if (this.selectedAction) {
      filtered = filtered.filter(activity => 
        activity.action === this.selectedAction.value
      );
    }
    
    // กรองตามสถานะ
    if (this.selectedStatus) {
      filtered = filtered.filter(activity => 
        activity.status === this.selectedStatus.value
      );
    }
    
    this.filteredActivities = filtered;
  }
  
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
  
  openVisitorDialog() {
    if (this.isDialogMode) {
      // ถ้าเรากำลังอยู่ใน dialog แล้ว
      this.dialogService.open({
        component: 'ReportFilters',
        inputs: {
          initialFilters: {
            dateRange: this.dateRange,
            reportType: this.selectedAction ? { name: this.selectedAction.name, code: this.selectedAction.value } : null
          },
          isDialogMode: true,
          exportEnabled: true
        },
        title: 'รายงานผู้เข้าชม',
        fullscreen: true
      });
    } else {
      // เปิดผ่าน URL
      this.dialogService.openViaUrl('ReportFilters', { 
        title: 'รายงานผู้เข้าชม',
        dateRange: JSON.stringify(this.dateRange),
        actionType: this.selectedAction ? JSON.stringify(this.selectedAction) : null,
        exportEnabled: 'true',
        fullscreen: 'true'
      });
    }
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