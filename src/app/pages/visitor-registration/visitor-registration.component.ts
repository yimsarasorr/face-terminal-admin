import { Component, OnInit } from '@angular/core'; // **เอา OnDestroy, Subject, takeUntil ออกได้ถ้าไม่ได้ใช้แล้ว**
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Models and Services
import { StepItem, VisitorData } from './models/visitor-workflow.model';
import { VisitorNavigationService } from '../../services/visitor-navigation.service';
import { VisitorWorkflowService } from '../../services/visitor-workflow.service';
import { DialogService } from '../../services/dialog.service'; // **Path นี้อาจจะต้องแก้ให้ถูก**

// Step Components
import { SelectBuildingComponent } from './steps/select-building/select-building.component';
import { VisitorFormComponent } from './steps/visitor-form/visitor-form.component';
import { SummaryComponent } from './steps/summary/summary.component';

@Component({
  selector: 'app-visitor-registration',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DialogModule,
    ButtonModule,
    StepsModule,
    ToastModule,
    SelectBuildingComponent,
    VisitorFormComponent,
    SummaryComponent
  ],
  providers: [MessageService],
  templateUrl: './visitor-registration.component.html',
  styleUrls: ['./visitor-registration.component.scss']
})
export class VisitorRegistrationComponent implements OnInit {
  
  visitorData: VisitorData = {};

  steps$: Observable<StepItem[]>;
  currentStep$: Observable<StepItem | null>;
  activeIndex$: Observable<number>;

  constructor(
    public navigationService: VisitorNavigationService,
    private workflowService: VisitorWorkflowService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    this.steps$ = new Observable(subscriber => subscriber.next(this.workflowService.getSteps()));
    this.currentStep$ = this.navigationService.currentStep$;
    this.activeIndex$ = this.navigationService.activeIndex$;
  }

  ngOnInit(): void {
    this.visitorData = {};
    this.navigationService.startFlow();
  }

  onNextStep(dataFromStep: any): void {
    this.visitorData = { ...this.visitorData, ...dataFromStep };
    this.navigationService.goToNextStep();
  }
  
  onPreviousStep(): void {
    this.navigationService.goToPreviousStep();
  }
  
  onConfirmRegistration(): void {
    console.log('ข้อมูลลงทะเบียนทั้งหมด:', this.visitorData);
    this.dialogService.close(this.visitorData);
    this.messageService.add({ 
      severity: 'success', 
      summary: 'ลงทะเบียนสำเร็จ', 
      detail: 'บันทึกข้อมูลผู้มาติดต่อเรียบร้อย' 
    });
  }

  onStepChange(index: number): void {
    this.navigationService.goToStep(index);
  }

  onCancel(): void {
    this.dialogService.close();
    this.messageService.add({ severity: 'warn', summary: 'ยกเลิก', detail: 'ยกเลิกการลงทะเบียน' });
  }
}