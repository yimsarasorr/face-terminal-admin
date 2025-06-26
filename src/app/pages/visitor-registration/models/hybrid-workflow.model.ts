import { PageId } from './page-id.enum';

export interface VisitorData {
  visitorType?: 'new' | 'returning';
  building?: string;
  firstName?: string;
  lastName?: string;
  preRegistrationCode?: string;
  termsAccepted?: boolean;
}

export interface NextCondition {
  condition: {
    field: string;
    operator: '==' | '!=';
    value: any;
  };
  goTo: string; // stepId
}

export interface Subflow {
  id: string;          // ID ของ subflow, e.g., 'terms-condition-subflow'
  startStepId: string; // Step แรกที่จะเริ่มใน subflow
  steps: HybridStep[]; // Array ของ step ที่อยู่ใน subflow
}

export interface HybridStep {
  stepId: string;
  pageId: PageId;
  title: string;
  back: string | null;
  next: string | null | NextCondition[];
  subflow?: Subflow; // +++ เพิ่ม property นี้เข้ามา ทำให้ Step สามารถมี Subflow ได้ (optional)
}

export interface Chapter {
  chapterId: string;
  chapterName: string;
  startStepId: string;
  steps: HybridStep[];
}

export interface HybridWorkflow {
  id: string;
  name: string;
  startChapterId: string;
  chapters: Chapter[];
}