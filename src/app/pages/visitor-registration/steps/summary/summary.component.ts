import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { WorkflowEngineService } from '../../../../services/workflow-engine.service';
import { VisitorData } from '../../models/hybrid-workflow.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {
  private workflowEngine = inject(WorkflowEngineService);
  private dialogConfig = inject(DynamicDialogConfig);

  // --- ส่วนที่แก้ไข: เปลี่ยนชื่อ property ให้ตรงกับที่ template เรียกใช้ ---
  public data: VisitorData | null = null; 

  ngOnInit(): void {
    this.data = this.dialogConfig.data.workflowData;
  }

  // --- ส่วนที่แก้ไข: เปลี่ยนชื่อเมธอดให้ตรงกับที่ template เรียกใช้ ---
  onConfirm(): void {
    console.log('Final workflow data:', this.data);
    this.workflowEngine.next(); // สั่งให้ workflow จบการทำงาน
  }

  onBack(): void {
    this.workflowEngine.back();
  }
}