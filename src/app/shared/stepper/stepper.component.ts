import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { WorkflowStateService } from '../../services/workflow-state.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, StepsModule],
  template: `
    <div class="card">
      <p-steps 
        [model]="stateService.stepperItems()" 
        [activeIndex]="stateService.activeIndex()"
        [readonly]="true">
      </p-steps>
    </div>
  `,
  styleUrls: ['./stepper.component.scss']
})

export class StepperComponent {
  public stateService = inject(WorkflowStateService);
}