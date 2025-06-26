import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';
import { VisitorData } from '../../models/hybrid-workflow.model'; // <-- Import VisitorData

@Component({
  selector: 'app-visitor-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, ButtonModule],
  templateUrl: './visitor-type.component.html',
})
export class VisitorTypeComponent {
  private workflowEngine = inject(WorkflowEngineService);

  // --- ส่วนที่แก้ไข: กำหนด Type ให้ FormControl ตรงกับ Model ---
  form = new FormGroup({
    visitorType: new FormControl<'new' | 'returning' | null>(null, Validators.required)
  });

  onNext(): void {
    if (this.form.valid) {
      // --- ส่วนที่แก้ไข: สร้าง object ใหม่ที่ Type ถูกต้อง ---
      const formData: Partial<VisitorData> = {
        visitorType: this.form.controls.visitorType.value! // ใช้ ! เพื่อบอก TypeScript ว่าเรามั่นใจว่าค่าไม่เป็น null เพราะผ่าน .valid มาแล้ว
      };
      this.workflowEngine.next(formData);
    }
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}