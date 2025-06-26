// src/app/services/workflow-engine.service.ts

import { Injectable, signal, inject } from '@angular/core';
import { DialogService } from './dialog.service';
import { VISITOR_WORKFLOW } from '../pages/visitor-registration/visitor-workflow-data';
import {
  HybridWorkflow,
  HybridStep,
  NextCondition,
  VisitorData,
  Subflow,
} from '../pages/visitor-registration/models/hybrid-workflow.model';

// Interface สำหรับ State ของ Workflow
export interface WorkflowState {
  workflowId: string | null;
  currentChapterId: string | null;
  currentStepId: string | null;
  history: string[]; // เก็บประวัติ stepId เพื่อใช้ในการย้อนกลับ
  workflowData: VisitorData;
  activeSubflow: { // Object สำหรับเก็บสถานะของ subflow ที่กำลังทำงาน
    id: string;
    parentStepId: string;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowEngineService {
  private workflow: HybridWorkflow = VISITOR_WORKFLOW;
  private dialogService: DialogService = inject(DialogService);

  private state = signal<WorkflowState>({
    workflowId: null,
    currentChapterId: null,
    currentStepId: null,
    history: [],
    workflowData: {},
    activeSubflow: null,
  });

  // --- Public signals ---
  public readonly currentStep = signal<HybridStep | null>(null);
  public readonly workflowData = this.state.asReadonly();

  constructor() {}

  /**
   * เริ่มต้น Workflow ทั้งหมด
   */
  public start() {
    const startChapter = this.workflow.chapters.find(c => c.chapterId === this.workflow.startChapterId);
    if (!startChapter) {
        console.error('Start chapter not found!');
        return;
    }
    
    // ปิด Dialog เก่าทั้งหมดที่อาจจะค้างอยู่
    this.dialogService.closeAll();

    this.state.set({
      workflowId: this.workflow.id,
      currentChapterId: startChapter.chapterId, // เพิ่มการกำหนด chapterId เริ่มต้น
      currentStepId: startChapter.startStepId,
      history: [],
      workflowData: {},
      activeSubflow: null,
    });

    this.navigateToStep(startChapter.startStepId);
  }

  /**
   * ไปยังขั้นตอนถัดไป
   */
  public next(data?: Partial<VisitorData>) {
    if (data) {
      this.updateWorkflowData(data);
    }
    
    const currentState = this.state();

    // ถ้ากำลังทำงานใน subflow, การกด next จะหมายถึงการจบ subflow นั้น
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

  /**
   * ย้อนกลับไปยังขั้นตอนก่อนหน้า
   */
  public back() {
    // ไม่อนุญาตให้กดย้อนกลับขณะอยู่ใน subflow
    if (this.state().activeSubflow) return;

    const previousStepId = this.state().history[this.state().history.length - 2];
    if (previousStepId) {
      this.navigateToStep(previousStepId, true); // true = isNavigatingBack
    }
  }

  /**
   * หัวใจหลักของการนำทาง: เปิด Dialog หลักก่อน แล้วค่อยเช็คเพื่อเปิด Subflow ซ้อนทับ
   */
  private navigateToStep(stepId: string, isNavigatingBack: boolean = false) {
    const step = this.findStepById(stepId);
    if (!step) return;

    // อัปเดต state ก่อนเสมอ
    this.state.update(s => {
      const newHistory = isNavigatingBack ? s.history.slice(0, -1) : [...s.history, stepId];
      return { ...s, currentStepId: stepId, history: newHistory };
    });
    this.currentStep.set(step);

    // ปิด Dialog ที่อยู่บนสุดก่อนเสมอเมื่อมีการนำทาง (ยกเว้นตอนเริ่ม subflow)
    if (this.state().activeSubflow === null) {
      this.dialogService.close();
    }
    
    // 1. เปิด Dialog ของ Step ปัจจุบันก่อน
    this.dialogService.open(step, this.state().workflowData);

    // 2. จากนั้น ตรวจสอบว่ามี subflow หรือไม่ และไม่ใช่การย้อนกลับ
    if (step.subflow && !isNavigatingBack) {
      // 3. ถ้ามี ให้เริ่ม subflow (ซึ่งจะเปิด Dialog ซ้อนทับขึ้นมา)
      this.startSubflow(step.subflow, step.stepId);
    }
  }

  /**
   * เริ่ม Subflow โดยการเปิด Dialog ซ้อนทับ
   */
  private startSubflow(subflow: Subflow, parentStepId: string) {
    console.log(`Starting subflow: ${subflow.id} from parent: ${parentStepId}`);
    this.state.update(s => ({
      ...s,
      activeSubflow: { id: subflow.id, parentStepId: parentStepId },
    }));

    const subflowStartStep = subflow.steps.find(s => s.stepId === subflow.startStepId);
    if (subflowStartStep) {
      // เปิด Dialog ของ Subflow โดยส่ง flag isSubflow เป็น true
      this.dialogService.open(subflowStartStep, this.state().workflowData, true);
    }
  }

  /**
   * จบ Subflow และกลับสู่ Dialog หลักที่รออยู่
   */
  private endSubflow() {
    console.log(`Ending subflow`);
    // ปิดเฉพาะ Dialog บนสุด (ซึ่งก็คือ Dialog ของ subflow)
    this.dialogService.close();
    
    // คืนสถานะ subflow
    this.state.update(s => ({ ...s, activeSubflow: null }));
    
    // ไม่ต้องทำอะไรต่อ เพราะ Dialog ของ step หลักยังคงเปิดอยู่ข้างหลัง
  }

  /**
   * ตัดสินใจว่าจะไป Step ไหนต่อ โดยดูจากเงื่อนไข
   */
  private determineNextStepId(step: HybridStep): string | null {
    const nextConfig = step.next;
    if (nextConfig === null || nextConfig === undefined) return null;
    if (typeof nextConfig === 'string') return nextConfig;

    const workflowData = this.state().workflowData;
    for (const nav of nextConfig) {
      const condition = nav.condition as NextCondition['condition'];
      const dataValue = (workflowData as any)[condition.field];
      if (condition.operator === '==' && dataValue == condition.value) return nav.goTo;
      if (condition.operator === '!=' && dataValue != condition.value) return nav.goTo;
    }
    return null;
  }

  /**
   * อัปเดตข้อมูลที่เก็บใน Workflow
   */
  private updateWorkflowData(data: Partial<VisitorData>) {
    this.state.update(s => ({...s, workflowData: { ...s.workflowData, ...data }}));
  }

  /**
   * ค้นหา Step จาก ID ในทุก Chapter และทุก Subflow
   */
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
}