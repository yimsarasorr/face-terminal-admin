import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';
import { StepperComponent } from '../../../../shared/stepper/stepper.component';

@Component({
  selector: 'app-pre-registration-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, StepperComponent],
  templateUrl: './pre-registration-code.component.html',
})
export class PreRegistrationCodeComponent {
  private workflowEngine = inject(WorkflowEngineService);

  form = new FormGroup({
    preRegistrationCode: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  onNext(): void {
    if (this.form.valid) {
      this.workflowEngine.next(this.form.getRawValue());
    }
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}