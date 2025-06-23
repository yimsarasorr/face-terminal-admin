import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// PrimeNG
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

// --- Import Engine และ Workflow ---
import { WorkflowEngineService } from '../../services/workflow-engine.service';
import { VISITOR_WORKFLOW } from './visitor-workflow-data';
import { HybridStep, VisitorData } from './models/hybrid-workflow.model';
import { PageId } from './models/page-id.enum';

// --- Import Service ---
import { DialogService } from '../../services/dialog.service';
import { VisitorTypeComponent } from './steps/visitor-type/visitor-type.component';
import { TermsConditionComponent } from './steps/terms-condition/terms-condition.component';
import { SelectBuildingComponent } from './steps/select-building/select-building.component';
import { VisitorFormComponent } from './steps/visitor-form/visitor-form.component';
import { PreRegistrationCodeComponent } from './steps/pre-registration-code/pre-registration-code.component';
import { SummaryComponent } from './steps/summary/summary.component';


@Component({
  selector: 'app-visitor-registration',
  standalone: true,
  imports: [
    CommonModule, AsyncPipe, StepsModule, ToastModule, ButtonModule,
    VisitorTypeComponent,
    TermsConditionComponent,
    SelectBuildingComponent,
    VisitorFormComponent,
    PreRegistrationCodeComponent,
    SummaryComponent
  ],
  providers: [MessageService],
  templateUrl: './visitor-registration.component.html',
  styleUrls: ['./visitor-registration.component.scss']
})
export class VisitorRegistrationComponent implements OnInit {
  
  visitorData: Partial<VisitorData> = {};
  currentStep$: Observable<HybridStep | null>;
  PageId = PageId;

  // สำหรับ p-steps
  stepsModel$: Observable<any[]>;
  activeIndex$: Observable<number>;

  constructor(
    private workflowEngine: WorkflowEngineService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.currentStep$ = this.workflowEngine.currentStep$;
    
    const allStepsInOrder = VISITOR_WORKFLOW.flatMap(c => c.steps);
    this.stepsModel$ = new Observable(s => s.next(
      allStepsInOrder.map(step => ({ label: step.title }))
    ));

    this.activeIndex$ = this.currentStep$.pipe(
      map(current => allStepsInOrder.findIndex(s => s.stepId === current?.stepId))
    );
  }

  ngOnInit(): void {
    this.workflowEngine.start(VISITOR_WORKFLOW);
  }


  onNext(dataFromStep: any): void {
    this.visitorData = { ...this.visitorData, ...dataFromStep };
    this.workflowEngine.calculateNextStep(this.visitorData);
  }
  
  onBack(): void {
    this.workflowEngine.goToPreviousStep();
  }
  
  onConfirm(): void {
    console.log('Final Visitor Data:', this.visitorData);
    this.dialogService.close(this.visitorData);
    this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลงทะเบียนเรียบร้อยแล้ว' });
  }

  onCancel(): void {
    this.dialogService.close();
  }

}