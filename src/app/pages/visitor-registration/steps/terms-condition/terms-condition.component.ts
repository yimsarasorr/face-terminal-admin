import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [CommonModule, ButtonModule, CheckboxModule, ReactiveFormsModule],
  templateUrl: './terms-condition.component.html',
})
export class TermsConditionComponent {
  private workflowEngine = inject(WorkflowEngineService);
  
  form = new FormGroup({
    accepted: new FormControl(false, Validators.requiredTrue)
  });

  onNext(): void {
    if (this.form.valid) {
      // --- ส่วนที่แก้ไข ---
      // แปลงค่าให้เป็น boolean เสมอ (ถ้าเป็น null จะกลายเป็น false)
      const acceptedValue = this.form.controls.accepted.value || false; 
      this.workflowEngine.next({ termsAccepted: acceptedValue });
    }
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}