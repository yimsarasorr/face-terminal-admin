import { Injectable, inject } from '@angular/core';
import { DialogService as PrimeNgDialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ComponentMappingService } from './component-mapping.service';
import { HybridStep, VisitorData } from '../pages/visitor-registration/models/hybrid-workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowDialogService {
  private primengDialog: PrimeNgDialogService = inject(PrimeNgDialogService);
  private componentMappingService: ComponentMappingService = inject(ComponentMappingService);
  
  private dialogRefs: DynamicDialogRef[] = [];

  async open(step: HybridStep, workflowData: VisitorData, isSubflow: boolean = false): Promise<void> {
    if (!isSubflow) {
      await this.closeAll();
    }

    try {
      const component = await this.componentMappingService.getComponentForPage(step.pageId);
      if (!component) return;

      let dialogConfig: any;
      if (isSubflow) {
        dialogConfig = {
          header: step.title,
          data: { step, workflowData },
          width: '50vw',
          styleClass: 'subflow-dialog',
          modal: true,
          baseZIndex: 10001,
        };
      } else {
        dialogConfig = {
          data: { step, workflowData },
          styleClass: 'main-workflow-dialog fullscreen-dialog',
          showHeader: false,
          closable: false,
          modal: true,
        };
      }
      
      const newDialogRef = this.primengDialog.open(component, dialogConfig);
      this.dialogRefs.push(newDialogRef);
      newDialogRef.onClose.subscribe(() => {
        this.dialogRefs = this.dialogRefs.filter(ref => ref !== newDialogRef);
      });

    } catch (error) {
      console.error(`Failed to open dialog for step: ${step.stepId}`, error);
    }
  }

  close() {
    if (this.dialogRefs.length > 0) {
      this.dialogRefs.pop()?.close();
    }
  }

  closeAll() {
    this.dialogRefs.forEach(ref => ref.close());
    this.dialogRefs = [];
    return Promise.resolve();
  }
}