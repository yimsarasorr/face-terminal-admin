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

export interface HybridStep {
  stepId: string;
  pageId: PageId;
  title: string;
  back: string | null;
  next: string | null | NextCondition[];
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