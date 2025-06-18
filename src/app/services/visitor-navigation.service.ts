import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepItem } from '../pages/visitor-registration/models/visitor-workflow.model';
import { VisitorWorkflowService } from './visitor-workflow.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorNavigationService {
  private steps: StepItem[] = [];

  private activeIndexSub = new BehaviorSubject<number>(0);
  public activeIndex$: Observable<number> = this.activeIndexSub.asObservable();

  private currentStepSub = new BehaviorSubject<StepItem | null>(null);
  public currentStep$: Observable<StepItem | null> = this.currentStepSub.asObservable();

  constructor(private workflowService: VisitorWorkflowService) { }

  startFlow(): void {
    this.steps = this.workflowService.getSteps();
    this.activeIndexSub.next(0);
    this.currentStepSub.next(this.steps[0]);
  }

  goToNextStep(): void {
    if (this.canGoForward()) {
      const nextIndex = this.activeIndexSub.value + 1;
      this.activeIndexSub.next(nextIndex);
      this.currentStepSub.next(this.steps[nextIndex]);
    }
  }

  goToPreviousStep(): void {
    if (this.canGoBack()) {
      const prevIndex = this.activeIndexSub.value - 1;
      this.activeIndexSub.next(prevIndex);
      this.currentStepSub.next(this.steps[prevIndex]);
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.activeIndexSub.next(index);
      this.currentStepSub.next(this.steps[index]);
    }
  }
  // -----------------------------

  canGoForward(): boolean {
    return this.activeIndexSub.value < this.steps.length - 1;
  }

  canGoBack(): boolean {
    return this.activeIndexSub.value > 0;
  }
}