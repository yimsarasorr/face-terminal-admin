import { Chapter } from "./models/hybrid-workflow.model";
import { PageId } from "./models/page-id.enum";

export const VISITOR_WORKFLOW: Chapter[] = [
  {
    chapterId: '1',
    chapterName: 'เริ่มต้น',
    startStepId: '1.1',
    steps: [
      {
        stepId: '1.1',
        pageId: PageId.VISITOR_TYPE,
        title: 'ยินดีต้อนรับ',
        back: null,
        next: [
          {
            condition: { field: 'visitorType', operator: '==', value: 'new' },
            goTo: '2.1'
          },
          {
            condition: { field: 'visitorType', operator: '==', value: 'returning' },
            goTo: '3.1'
          }
        ]
      }
    ]
  },
  {
    chapterId: '2',
    chapterName: 'ลงทะเบียนผู้ใช้ใหม่',
    startStepId: '2.1',
    steps: [
      {
        stepId: '2.1',
        pageId: PageId.TERMS_CONDITION,
        title: 'ข้อกำหนดและเงื่อนไข',
        back: '1.1',
        next: '2.2'
      },
      {
        stepId: '2.2',
        pageId: PageId.SELECT_BUILDING,
        title: 'ขั้นตอนที่ 1: เลือกพื้นที่อาคาร',
        back: '2.1',
        next: '2.3'
      },
      {
        stepId: '2.3',
        pageId: PageId.VISITOR_FORM,
        title: 'ขั้นตอนที่ 2: กรอกข้อมูลส่วนตัว',
        back: '2.2',
        next: '4.1'
      }
    ]
  },
  {
    chapterId: '3',
    chapterName: 'สำหรับผู้ลงทะเบียนล่วงหน้า',
    startStepId: '3.1',
    steps: [
      {
        stepId: '3.1',
        pageId: PageId.PRE_REGISTRATION_CODE,
        title: 'ยืนยันรหัส',
        back: '1.1',
        next: '4.1'
      }
    ]
  },
  {
    chapterId: '4',
    chapterName: 'สรุป',
    startStepId: '4.1',
    steps: [
      {
        stepId: '4.1',
        pageId: PageId.SUMMARY,
        title: 'ขั้นตอนที่ 3: ตรวจสอบและยืนยันข้อมูล',
        back: '2.3',
        next: null
      }
    ]
  }
];