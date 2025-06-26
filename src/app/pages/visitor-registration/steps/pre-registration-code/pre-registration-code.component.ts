import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';

@Component({
  selector: 'app-pre-registration-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './pre-registration-code.component.html',
})
export class PreRegistrationCodeComponent {
  private workflowEngine = inject(WorkflowEngineService);

  // --- ส่วนที่แก้ไข: ทำให้ Type ของ FormControl ชัดเจนว่าเป็น string ---
  form = new FormGroup({
    preRegistrationCode: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  onNext(): void {
    if (this.form.valid) {
      // --- ส่วนที่แก้ไข: getRawValue() ตอนนี้จะคืนค่าเป็น {preRegistrationCode: string} ซึ่งเข้ากันได้ ---
      this.workflowEngine.next(this.form.getRawValue());
    }
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}