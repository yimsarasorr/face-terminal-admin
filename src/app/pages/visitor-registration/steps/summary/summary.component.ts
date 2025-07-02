import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';
import { VisitorData } from '../../models/hybrid-workflow.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { StepperComponent } from '../../../../shared/stepper/stepper.component';
import { WorkflowStateService } from '../../../../services/workflow-state.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, StepperComponent],
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {
  private workflowEngine = inject(WorkflowEngineService);
  private dialogConfig = inject(DynamicDialogConfig);
  public stateService = inject(WorkflowStateService);

  public data: VisitorData | null = null;

  ngOnInit(): void {
    this.data = this.dialogConfig.data.workflowData;
  }

  onConfirm(): void {
    console.log('Final workflow data:', this.data);
    this.workflowEngine.next();
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}