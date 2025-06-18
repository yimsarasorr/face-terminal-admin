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
            <h5>ตัวกรองที่เลือก</h5>
            
            <div class="field">
                <label class="font-medium">ช่วงวันที่:</label>
                <div>{{ dateRangeText }}</div>
            </div>
            
            <div class="field">
                <label class="font-medium">ประเภทรายงาน:</label>
                <div>{{ reportType?.name || 'ทุกประเภท' }}</div>
            </div>
            
            <div class="field">
                <label class="font-medium">สถานที่:</label>
                <div *ngIf="!locations || locations.length === 0">ทุกสถานที่</div>
                <ul *ngIf="locations && locations.length > 0" class="m-0 p-0 list-none">
                    <li *ngFor="let location of locations" class="mb-2">
                        {{ location.name }}
                    </li>
                </ul>
            </div>

            <ng-container *ngIf="additionalInfo">
                <h5 class="mt-4">ข้อมูลเพิ่มเติม</h5>
                <div *ngFor="let item of additionalInfoArray" class="field">
                    <label class="font-medium">{{ item.label }}:</label>
                    <div>{{ item.value }}</div>
                </div>
            </ng-container>
        </div>
    `
})
export class ReportDetailComponent {
    @Input() dateRangeText: string = 'ทุกวัน';
    @Input() reportType: ReportType | null = null;
    @Input() locations: Location[] = [];
    @Input() additionalInfo: any = null;

    get additionalInfoArray(): {label: string, value: string}[] {
        if (!this.additionalInfo) return [];

        return Object.keys(this.additionalInfo).map(key => {
            let label = key;
            let value = this.additionalInfo[key];
            
            // แปลงคีย์เป็นข้อความที่อ่านง่ายขึ้น
            switch (key) {
                case 'minEntries':
                    label = 'จำนวนรายการขั้นต่ำ';
                    break;
                case 'includeSystemLogs':
                    label = 'รวมบันทึกระบบ';
                    value = value ? 'ใช่' : 'ไม่';
                    break;
                // เพิ่มกรณีอื่นๆ ตามต้องการ
            }
            
            return { label, value: String(value) };
        });
    }
}