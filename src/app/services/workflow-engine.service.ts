import { Injectable, signal, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; // เพิ่ม NavigationEnd
import { filter } from 'rxjs'; // เพิ่ม filter
import { WorkflowDialogService } from './workflow-dialog.service';
import { WorkflowStateService } from './workflow-state.service';
import { VISITOR_WORKFLOW } from '../pages/visitor-registration/visitor-workflow-data';
import {
  HybridWorkflow,
  HybridStep,
  NextCondition,
  VisitorData,
  Subflow,
  Chapter,
} from '../pages/visitor-registration/models/hybrid-workflow.model';

@Injectable({
  providedIn: 'root',
})
export class WorkflowEngineService {
  private workflow: HybridWorkflow = VISITOR_WORKFLOW;
  private dialogService: WorkflowDialogService = inject(WorkflowDialogService);
  private stateService: WorkflowStateService = inject(WorkflowStateService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    // --- ส่วนที่เพิ่มเข้ามาที่ 1: ให้ Engine คอยดักฟัง URL เพื่อเริ่มทำงาน ---
    this.listenToUrlChangesForStart();

    // ดักฟังเมื่อ Dialog ถูกปิดโดยผู้ใช้ (โค้ดนี้อาจไม่จำเป็น ถ้าไม่มีปัญหา)
    // this.dialogService.onClose.subscribe(() => { ... });
  }
  
  // --- เพิ่มเมธอดนี้เข้ามาใหม่ ---
  private listenToUrlChangesForStart(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      const params = this.route.snapshot.queryParams;
      const workflowId = params['workflowId'];
      const startStep = params['step'];

      if (workflowId === this.workflow.id && startStep && !this.stateService.state().workflowId) {
        console.log(`WorkflowEngine: Detected URL, starting at step ${startStep}`);
        this.startAtStep(startStep);
      }
    });
  }

  public start() {
    const startChapter = this.workflow.chapters.find(c => c.chapterId === this.workflow.startChapterId);
    if (!startChapter) {
      console.error('Start chapter not found!');
      return;
    }
    this.startAtStep(startChapter.startStepId);
  }

  public startAtStep(stepId: string, initialData?: Partial<VisitorData>) {
    const step = this.findStepById(stepId);
    const chapter = this.findChapterByStepId(stepId);

    if (!step || !chapter) {
      console.error(`Cannot start workflow: Step or Chapter not found for stepId "${stepId}"`);
      return;
    }

    this.dialogService.closeAll();

    // อัปเดต state
    this.stateService.state.set({
      workflowId: this.workflow.id,
      currentChapterId: chapter.chapterId,
      currentStepId: null, // เริ่มเป็น null ก่อน
      history: [],
      workflowData: initialData || {},
      activeSubflow: null,
    });

    this.navigateToStep(step.stepId);
  }

  public next(data?: Partial<VisitorData>) {
    if (data) this.updateWorkflowData(data);

    const currentState = this.stateService.state(); 
    if (currentState.activeSubflow) {
      this.endSubflow();
      return;
    }
    const currentStep = this.findStepById(currentState.currentStepId!);
    if (!currentStep) return;
    const nextStepId = this.determineNextStepId(currentStep);
    if (nextStepId) {
      this.navigateToStep(nextStepId);
    } else {
      console.log('Workflow Ended.');
      this.clearWorkflowStateAndUrl(); // <-- แก้ไข: เรียกใช้เมธอดนี้
    }
  }

  public back() {
    const currentState = this.stateService.state();
    if (currentState.activeSubflow) return;
    const previousStepId = currentState.history[currentState.history.length - 2];
    if (previousStepId) {
      this.navigateToStep(previousStepId, true);
    }
  }

  public clearWorkflowStateAndUrl(): void {
    this.dialogService.closeAll();
    this.stateService.state.set({
      workflowId: null, currentChapterId: null, currentStepId: null,
      history: [], workflowData: {}, activeSubflow: null
    });
    // สั่งลบ Query Params ออกจาก URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { workflowId: null, step: null },
      queryParamsHandling: 'merge',
    });
  }

  private navigateToStep(stepId: string, isNavigatingBack: boolean = false) {
    const step = this.findStepById(stepId);
    if (!step) return;

    this.stateService.state.update(s => {
      const newHistory = isNavigatingBack 
        ? s.history.slice(0, -1) 
        : [...s.history, stepId];
      return { ...s, currentStepId: stepId, history: newHistory };
    });

    // เรียกใช้ updateUrlQueryParam เฉพาะเมื่อไม่ได้อยู่ใน subflow
    const currentState = this.stateService.state();
    if (!currentState.activeSubflow) {
      this.updateUrlQueryParam(stepId);
    }

    if (currentState.activeSubflow === null) {
      if(!isNavigatingBack) this.dialogService.close();
    }
    
    this.dialogService.open(step, currentState.workflowData, currentState.activeSubflow !== null);

    if (step.subflow && !isNavigatingBack) {
      this.startSubflow(step.subflow, step.stepId);
    }
  }

  private startSubflow(subflow: Subflow, parentStepId: string) {
    this.stateService.state.update(s => ({ ...s, activeSubflow: { id: subflow.id, parentStepId: parentStepId }}));
    const subflowStartStep = subflow.steps.find(s => s.stepId === subflow.startStepId);
    if (subflowStartStep) {
      this.dialogService.open(subflowStartStep, this.stateService.state().workflowData, true);
    }
  }

  private endSubflow() {
    this.dialogService.close();
    this.stateService.state.update(s => ({ ...s, activeSubflow: null }));
  }

  private determineNextStepId(step: HybridStep): string | null {
    const nextConfig = step.next;
    if (nextConfig === null || nextConfig === undefined) return null;
    if (typeof nextConfig === 'string') return nextConfig;
    
    const workflowData = this.stateService.state().workflowData;
    for (const nav of nextConfig) {
      const condition = nav.condition as NextCondition['condition'];
      const dataValue = (workflowData as any)[condition.field];
      if (condition.operator === '==' && dataValue == condition.value) return nav.goTo;
      if (condition.operator === '!=' && dataValue != condition.value) return nav.goTo;
    }
    return null;
  }

  private updateWorkflowData(data: Partial<VisitorData>) {
    this.stateService.state.update(s => ({...s, workflowData: { ...s.workflowData, ...data }}));
  }

  private findStepById(stepId: string): HybridStep | undefined {
    for (const chapter of this.workflow.chapters) {
      let found = chapter.steps.find((s) => s.stepId === stepId);
      if (found) return found;
      for (const mainStep of chapter.steps) {
        if (mainStep.subflow) {
          found = mainStep.subflow.steps.find(subf => subf.stepId === stepId);
          if (found) return found;
        }
      }
    }
    return undefined;
  }
  
  private findChapterByStepId(stepId: string): Chapter | undefined {
    for (const chapter of this.workflow.chapters) {
      for (const step of chapter.steps) {
        if (step.stepId === stepId) {
          return chapter;
        }
        if (step.subflow?.steps.some(subStep => subStep.stepId === stepId)) {
          return chapter;
        }
      }
    }
    return undefined;
  }

  // --- ส่วนที่แก้ไข: ยกเครื่อง updateUrlQueryParam ให้แน่นอนที่สุด ---
  private updateUrlQueryParam(stepId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        workflowId: this.workflow.id, // ใช้ ID จาก workflow โดยตรง
        step: stepId
      },
      queryParamsHandling: 'merge' // ใช้ 'merge' เพื่อรักษา query param อื่นๆ
    });
  }
}