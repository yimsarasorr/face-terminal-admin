import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';
import { VisitorData } from '../../models/hybrid-workflow.model';
import { StepperComponent } from '../../../../shared/stepper/stepper.component';
import { WorkflowStateService } from '../../../../services/workflow-state.service';

@Component({
  selector: 'app-visitor-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, ButtonModule, StepperComponent],
  templateUrl: './visitor-type.component.html',
})
export class VisitorTypeComponent {
  private workflowEngine = inject(WorkflowEngineService);
  public stateService = inject(WorkflowStateService); 

  form = new FormGroup({
    visitorType: new FormControl<'new' | 'returning' | null>(null, Validators.required)
  });

  onNext(): void {
    if (this.form.valid) {
      const formData: Partial<VisitorData> = {
        visitorType: this.form.controls.visitorType.value!
      };
      this.workflowEngine.next(formData);
    }
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}