import { PageId } from './models/page-id.enum';
import { HybridWorkflow } from './models/hybrid-workflow.model';

export const VISITOR_WORKFLOW: HybridWorkflow = {
  id: 'visitor-registration-workflow',
  name: 'Visitor Registration Workflow',
  startChapterId: '1',
  chapters: [
    {
      chapterId: '1',
      chapterName: 'ประเภทผู้มาติดต่อ',
      startStepId: '1.1',
      steps: [
        {
          stepId: '1.1',
          pageId: PageId.VISITOR_TYPE,
          title: 'ประเภทผู้มาติดต่อ',
          back: null,
          next: [
            { condition: { field: 'visitorType', operator: '==', value: 'new' }, goTo: '2.1' },
            { condition: { field: 'visitorType', operator: '==', value: 'returning' }, goTo: '3.1' },
          ],
        },
      ],
    },
    {
      chapterId: '2',
      chapterName: 'ลงทะเบียนสำหรับผู้มาติดต่อใหม่',
      startStepId: '2.1',
      steps: [
        {
          stepId: '2.1',
          pageId: PageId.SELECT_BUILDING,
          title: 'เลือกพื้นที่/อาคาร',
          back: '1.1',
          next: '2.2',
          subflow: {
            id: 'terms-condition-subflow',
            startStepId: 'sub-terms.1',
            steps: [
              {
                stepId: 'sub-terms.1',
                pageId: PageId.TERMS_CONDITION,
                title: 'ข้อกำหนดและเงื่อนไข',
                back: null,
                next: null,
              },
            ],
          },
        },
        {
          stepId: '2.2',
          pageId: PageId.VISITOR_FORM,
          title: 'ข้อมูลผู้มาติดต่อ',
          back: '2.1',
          next: '2.3',
        },
        {
          stepId: '2.3',
          pageId: PageId.SUMMARY,
          title: 'สรุปข้อมูล',
          back: '2.2',
          next: null,
        },
      ],
    },
    {
      chapterId: '3',
      chapterName: 'สำหรับผู้มาติดต่อที่เคยลงทะเบียน',
      startStepId: '3.1',
      steps: [
        {
          stepId: '3.1',
          pageId: PageId.PRE_REGISTRATION_CODE,
          title: 'กรอกรหัส Pre-Registration',
          back: '1.1',
          next: '2.3',
        },
      ],
    },
  ],
};