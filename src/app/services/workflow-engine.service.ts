import { Injectable, inject } from '@angular/core';
import { WorkflowDialogService } from './workflow-dialog.service';
import { WorkflowStateService } from './workflow-state.service'; // ++ Import State Service
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
  private stateService = inject(WorkflowStateService);

  constructor() {}

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

    this.stateService.state.set({
      workflowId: this.workflow.id,
      currentChapterId: chapter.chapterId,
      currentStepId: step.stepId,
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
      this.dialogService.closeAll();
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

  private navigateToStep(stepId: string, isNavigatingBack: boolean = false) {
    const step = this.findStepById(stepId);
    if (!step) return;

    this.stateService.state.update(s => {
      const newHistory = isNavigatingBack 
        ? s.history.slice(0, -1) 
        : [...s.history, stepId];
      return { ...s, currentStepId: stepId, history: newHistory };
    });

    const currentState = this.stateService.state();
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
}