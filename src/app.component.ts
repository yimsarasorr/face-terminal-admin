import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router'; 
import { DialogHostComponent } from './app/shared/components/dialog-host.component';
import { ComponentRegistryService } from './app/services/component-registry.service';
import { ActivityReport } from './app/pages/reports/components/activity-report';
import { ReportFiltersComponent } from './app/pages/reports/components/report-filters';
import { ReportDetailComponent } from './app/pages/reports/components/report-detail.component';
import { VisitorRegistrationComponent } from './app/pages/visitor-registration/visitor-registration.component';
import { WorkflowEngineService } from './app/services/workflow-engine.service';
import { filter, map, take } from 'rxjs'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, DialogHostComponent],
  template: `
    <router-outlet></router-outlet>
    <app-dialog-host></app-dialog-host>
  `
})
export class AppComponent implements OnInit {
  
  private componentRegistry = inject(ComponentRegistryService);
  private route = inject(ActivatedRoute);
  private workflowEngine = inject(WorkflowEngineService);
  private router = inject(Router); 
  
  ngOnInit() {
    this.componentRegistry.register('ActivityReport', ActivityReport);
    this.componentRegistry.register('ReportFilters', ReportFiltersComponent);
    this.componentRegistry.register('ReportDetailComponent', ReportDetailComponent);
    this.componentRegistry.register('VisitorRegistration', VisitorRegistrationComponent);
    
    this.handleWorkflowFromUrl();
  }

  private handleWorkflowFromUrl(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      take(1),
      map(() => this.route.snapshot.queryParams)
    ).subscribe(params => {
      // --- ส่วนที่แก้ไข: เปลี่ยน 'workflow' เป็น 'workflowId' ---
      const workflowId = params['workflowId'];
      const startStep = params['step'];

      // --- ส่วนที่แก้ไข: ตรวจสอบ workflowId ---
      if (workflowId && startStep) {
        console.log(`Starting workflow '${workflowId}' from URL with step: ${startStep}`);
        
        // เราสามารถเพิ่มเงื่อนไขได้อีกถ้ามีหลาย workflow
        if (workflowId === 'visitor-registration') {
            setTimeout(() => {
                this.workflowEngine.startAtStep(startStep);
            }, 0);
        }
      }
    });
  }
}