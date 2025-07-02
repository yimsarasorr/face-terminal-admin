import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';
import { WorkflowStateService } from '../../../../services/workflow-state.service';
import { StepperComponent } from '../../../../shared/stepper/stepper.component';

@Component({
  selector: 'app-visitor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, StepperComponent],
  templateUrl: './visitor-form.component.html',
})
export class VisitorFormComponent {
  private workflowEngine = inject(WorkflowEngineService);
  public stateService = inject(WorkflowStateService);

  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: Validators.required }),
    lastName: new FormControl('', { nonNullable: true, validators: Validators.required }),
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