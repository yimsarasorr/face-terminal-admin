import { Injectable } from '@angular/core';
import { StepItem } from '../pages/visitor-registration/models/visitor-workflow.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorWorkflowService {

  private readonly steps: StepItem[] = [
    {
      id: 'select-building',
      label: 'เลือกพื้นที่อาคาร',
      title: 'ขั้นตอนที่ 1: เลือกพื้นที่อาคาร'
    },
    {
      id: 'visitor-form',
      label: 'ลงทะเบียน',
      title: 'ขั้นตอนที่ 2: กรอกข้อมูลส่วนตัว'
    },
    {
      id: 'summary',
      label: 'ยืนยันข้อมูล',
      title: 'ขั้นตอนที่ 3: ตรวจสอบและยืนยันข้อมูล'
    }
  ];

  getSteps(): StepItem[] {
    return this.steps;
  }
}