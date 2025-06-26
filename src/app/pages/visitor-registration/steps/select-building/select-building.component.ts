import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';

@Component({
  selector: 'app-select-building',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, ButtonModule],
  templateUrl: './select-building.component.html',
})
export class SelectBuildingComponent {
  private workflowEngine = inject(WorkflowEngineService);

  buildings = [
    { name: 'อาคาร A', code: 'A' },
    { name: 'อาคาร B', code: 'B' },
    { name: 'อาคาร C', code: 'C' }
  ];

  // --- ส่วนที่แก้ไข: ดึง value จาก Dropdown เป็น string ไม่ใช่ object ---
  form = new FormGroup({
    building: new FormControl<string | null>(null, Validators.required)
  });

  onNext(): void {
    if (this.form.valid) {
      // --- ส่วนที่แก้ไข: สร้าง object ใหม่ที่ Type ถูกต้อง ---
      this.workflowEngine.next({
        building: this.form.controls.building.value!
      });
    }
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}