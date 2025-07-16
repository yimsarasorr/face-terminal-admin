import { Injectable, inject } from '@angular/core';
import { DialogService as PrimeNgDialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ComponentMappingService } from './component-mapping.service';
import { HybridStep, VisitorData } from '../pages/visitor-registration/models/hybrid-workflow.model';
import { Subject } from 'rxjs'; // เพิ่ม import

@Injectable({
  providedIn: 'root'
})
export class WorkflowDialogService {
  private primengDialog: PrimeNgDialogService = inject(PrimeNgDialogService);
  private componentMappingService: ComponentMappingService = inject(ComponentMappingService);
  
  private dialogRefs: DynamicDialogRef[] = [];
  
  // เพิ่ม Subject เพื่อแจ้งเตือนเมื่อ Dialog ถูกปิด
  public readonly onClose = new Subject<void>();

  async open(step: HybridStep, workflowData: VisitorData, isSubflow: boolean = false): Promise<void> {
    // ถ้าเป็นการเปิด dialog หลัก ให้ปิดของเก่าที่อาจจะค้างอยู่ก่อน
    if (!isSubflow) {
      await this.closeAll();
    }

    try {
      const component = await this.componentMappingService.getComponentForPage(step.pageId);
      if (!component) return;

      let dialogConfig: any;
      if (isSubflow) {
        // Config สำหรับ Dialog ที่ซ้อนอยู่ (Subflow)
        dialogConfig = {
          header: step.title,
          data: { step, workflowData },
          width: '50vw',
          styleClass: 'subflow-dialog',
          modal: true,
          baseZIndex: 10001,
        };
      } else {
        // Config สำหรับ Dialog หลัก (เต็มจอ)
        dialogConfig = {
          header: step.title, // แสดง Header เพื่อให้มีปุ่มปิด
          data: { step, workflowData },
          styleClass: 'main-workflow-dialog fullscreen-dialog',
          showHeader: true, // ทำให้ Header และปุ่มปิดแสดง
          closable: true,   // ทำให้กดปุ่ม X ปิดได้
          modal: true,
        };
      }
      
      const newDialogRef = this.primengDialog.open(component, dialogConfig);
      this.dialogRefs.push(newDialogRef);

      // จัดการเมื่อ Dialog ถูกปิด (ไม่ว่าจะด้วยวิธีใดก็ตาม)
      newDialogRef.onClose.subscribe(() => {
        this.dialogRefs = this.dialogRefs.filter(ref => ref !== newDialogRef);
        // ส่งสัญญาณว่า Dialog ถูกปิด (ถ้าเป็น dialog สุดท้ายที่เหลืออยู่)
        if (this.dialogRefs.length === 0) {
            this.onClose.next();
        }
      });

    } catch (error) {
      console.error(`Failed to open dialog for step: ${step.stepId}`, error);
    }
  }

  // ปิด Dialog ที่อยู่บนสุด
  close() {
    if (this.dialogRefs.length > 0) {
      this.dialogRefs.pop()?.close();
    }
  }

  // ปิดทุก Dialog
  closeAll() {
    this.dialogRefs.forEach(ref => ref.close());
    this.dialogRefs = [];
    return Promise.resolve();
  }
}