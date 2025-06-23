import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chapter, HybridStep, NextCondition } from '../pages/visitor-registration/models/hybrid-workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowEngineService {
  private workflowChapters: Chapter[] = [];
  private collectedData: any = {};

  private currentStepSub = new BehaviorSubject<HybridStep | null>(null);
  public currentStep$: Observable<HybridStep | null> = this.currentStepSub.asObservable();

  constructor() { }

  start(chapters: Chapter[], initialData: any = {}): void {
    this.workflowChapters = chapters;
    this.collectedData = initialData;

    const startChapter = this.workflowChapters[0];
    if (startChapter) {
      const startStep = startChapter.steps.find(s => s.stepId === startChapter.startStepId);
      if (startStep) {
        this.currentStepSub.next(startStep);
      }
    }
  }

  calculateNextStep(currentStepData: any): void {
    this.collectedData = { ...this.collectedData, ...currentStepData };
    const currentStep = this.currentStepSub.value;

    if (!currentStep || !currentStep.next) {
      console.log('Workflow Ended or no "next" defined.');
      return;
    }

    let nextStepId: string | null = null;

    if (typeof currentStep.next === 'string') {
      nextStepId = currentStep.next;
    } else {
      const matchingRoute = currentStep.next.find(condition => this.evaluateCondition(condition.condition));
      if (matchingRoute) {
        nextStepId = matchingRoute.goTo;
      } else {
        console.error('No matching condition for next step.');
      }
    }

    if (nextStepId) {
      this._goToStepById(nextStepId);
    }
  }

  goToPreviousStep(): void {
    const backStepId = this.currentStepSub.value?.back;
    if (backStepId) {
      this._goToStepById(backStepId);
    }
  }

  private evaluateCondition(condition: NextCondition['condition']): boolean {
    const dataValue = this.collectedData[condition.field];
    switch (condition.operator) {
      case '==': return dataValue == condition.value;
      case '!=': return dataValue != condition.value;
      default: return false;
    }
  }

  private _goToStepById(stepId: string): void {
    for (const chapter of this.workflowChapters) {
      const foundStep = chapter.steps.find(s => s.stepId === stepId);
      if (foundStep) {
        this.currentStepSub.next(foundStep);
        return;
      }
    }
    console.error(`Step with id "${stepId}" not found.`);
  }
}