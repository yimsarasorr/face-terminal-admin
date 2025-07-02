import { Injectable, computed, signal } from '@angular/core';
import { VISITOR_WORKFLOW } from '../pages/visitor-registration/visitor-workflow-data';
import { Chapter, HybridStep, VisitorData } from '../pages/visitor-registration/models/hybrid-workflow.model';
import { MenuItem } from 'primeng/api';

export interface WorkflowState {
  workflowId: string | null;
  currentChapterId: string | null;
  currentStepId: string | null;
  history: string[];
  workflowData: VisitorData;
  activeSubflow: {
    id: string;
    parentStepId: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowStateService {
  public state = signal<WorkflowState>({
    workflowId: null,
    currentChapterId: null,
    currentStepId: null,
    history: [],
    workflowData: {},
    activeSubflow: null,
  });

  public readonly canGoBack = computed<boolean>(() => {
    return this.state().history.length > 1;
  });

  public readonly currentStep = computed<HybridStep | undefined>(() => {
    const stepId = this.state().currentStepId;
    if (!stepId) return undefined;
    
    for (const chapter of VISITOR_WORKFLOW.chapters) {
      for (const mainStep of chapter.steps) {
        if (mainStep.stepId === stepId) return mainStep;
        if (mainStep.subflow) {
          const foundInSub = mainStep.subflow.steps.find(sub => sub.stepId === stepId);
          if (foundInSub) return foundInSub;
        }
      }
    }
    return undefined;
  });

  public readonly stepperItems = computed<MenuItem[]>(() => {
    const history = this.state().history;
    const workflowData = this.state().workflowData;

    const allStepsMap = new Map<string, HybridStep>(
      VISITOR_WORKFLOW.chapters.flatMap(c => c.steps).map(s => [s.stepId, s])
    );

    const newVisitorPathIds = ['1.1', '2.1', '2.2', '2.3', '2.4'];
    const returningVisitorPathIds = ['1.1', '3.1', '2.4'];
    const initialPathIds = ['1.1'];

    let activePathIds: string[] = [];

    if (workflowData.visitorType === 'new') {
      activePathIds = newVisitorPathIds;
    } else if (workflowData.visitorType === 'returning') {
      activePathIds = returningVisitorPathIds;
    } else {
      activePathIds = initialPathIds;
    }

    const relevantSteps = activePathIds
      .map(id => allStepsMap.get(id))
      .filter((s): s is HybridStep => s !== undefined);

    return relevantSteps.map(step => ({
      id: step.stepId,
      label: step.title,
      styleClass: history.includes(step.stepId) && this.state().currentStepId !== step.stepId ? 'completed' : ''
    }));
  });

  public readonly activeIndex = computed<number>(() => {
    const currentStepId = this.state().currentStepId;
    const parentStepId = this.state().activeSubflow?.parentStepId;
    const activeStepId = parentStepId || currentStepId;

    return this.stepperItems().findIndex(item => item.id === activeStepId);
  });
}