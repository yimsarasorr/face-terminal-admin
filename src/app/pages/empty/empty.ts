import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-empty',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="card">
            <h5>เลือกรายงานจากเมนูด้านซ้าย</h5>
            <p>กรุณาเลือกประเภทรายงานที่ต้องการจากเมนูด้านซ้ายเพื่อดูข้อมูล</p>
        </div>
    `
})
export class Empty {}
