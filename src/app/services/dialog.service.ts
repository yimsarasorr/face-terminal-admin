// src/app/services/dialog.service.ts

import { Injectable, inject } from '@angular/core';
import { DialogService as PrimeNgDialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ComponentMappingService } from './component-mapping.service';
import { HybridStep, VisitorData } from '../pages/visitor-registration/models/hybrid-workflow.model';
import { BehaviorSubject } from 'rxjs'; // เพิ่ม import

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private primengDialog: PrimeNgDialogService = inject(PrimeNgDialogService);
  private componentMappingService: ComponentMappingService = inject(ComponentMappingService);
  
  private dialogRefs: DynamicDialogRef[] = [];
  
  // +++ เพิ่มเข้ามาเพื่อแก้ Error `dialogState$` ใน dialog-host.component.ts +++
  public dialogState$ = new BehaviorSubject<any>(null);

  /**
   * Function Overloading: ประกาศรูปแบบการเรียกใช้ที่รองรับทั้งหมด
   */
  // รูปแบบที่ 1: สำหรับ Workflow ใหม่
  async open(step: HybridStep, workflowData: VisitorData, isSubflow?: boolean): Promise<void>;
  // รูปแบบที่ 2: สำหรับ Dialog ทั่วไป (แบบเก่า)
  async open(config: { component: string, [key: string]: any }): Promise<void>;

  /**
   * Implementation: โค้ดการทำงานจริงของเมธอด open
   */
  async open(stepOrConfig: HybridStep | any, workflowData?: VisitorData, isSubflow: boolean = false): Promise<void> {
    try {
      // ตรวจสอบว่าเป็น Workflow Step (มี stepId) หรือ Config แบบเก่า
      if (stepOrConfig.stepId && workflowData) {
        // === Logic สำหรับ Workflow ใหม่ ===
        const step = stepOrConfig as HybridStep;
        if (!isSubflow) this.close(); // ปิด dialog เก่าถ้าไม่ใช่ subflow

        const component = await this.componentMappingService.getComponentForPage(step.pageId);
        if (!component) return;

        let dialogConfig: any;
        if (isSubflow) {
          dialogConfig = { header: step.title, data: { step, workflowData }, width: '50vw', styleClass: 'subflow-dialog', modal: true, baseZIndex: 10001 };
        } else {
          dialogConfig = { data: { step, workflowData }, styleClass: 'main-workflow-dialog fullscreen-dialog', showHeader: false, closable: false, modal: true };
        }
        const newDialogRef = this.primengDialog.open(component, dialogConfig);
        this.dialogRefs.push(newDialogRef);
        newDialogRef.onClose.subscribe(() => {
            this.dialogRefs = this.dialogRefs.filter(ref => ref !== newDialogRef);
        });

      } else {
        // === Logic สำหรับ Dialog แบบเก่า (เพื่อให้ compile ผ่าน) ===
        this.closeAll(); // แบบเก่าจะปิดทั้งหมดก่อนเปิดใหม่
        const config = stepOrConfig as { component: string, [key: string]: any };
        console.warn('Opening dialog using LEGACY mode. This method should be refactored.');
        // คุณต้องไป implement logic การหา component จากชื่อ (config.component) เพื่อให้ทำงานได้จริง
        this.dialogState$.next(config);
      }
    } catch (error) {
      console.error(`Failed to open dialog`, error);
    }
  }

  // +++ เพิ่มเมธอด `openViaUrl` ที่หายไปกลับเข้ามา (แบบชั่วคราว) +++
  public openViaUrl(componentName: string, queryParams: any) {
    console.warn('openViaUrl is DEPRECATED and needs to be reimplemented.');
    this.dialogState$.next({ component: componentName, inputs: queryParams });
  }

  // ปิด Dialog บนสุด
  public close() {
    if (this.dialogRefs.length > 0) {
      this.dialogRefs.pop()?.close();
    }
  }

  // ปิดทุก Dialog
  public closeAll() {
    this.dialogRefs.forEach(ref => ref.close());
    this.dialogRefs = [];
  }
}