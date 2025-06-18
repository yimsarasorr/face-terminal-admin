import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogHostComponent } from './app/shared/components/dialog-host.component';
import { ComponentRegistryService } from './app/services/component-registry.service';
import { ActivityReport } from './app/pages/reports/components/activity-report';
import { ReportFilters } from './app/pages/reports/components/report-filters';
import { ReportDetailComponent } from './app/pages/reports/components/report-detail.component';
import { VisitorRegistrationComponent } from './app/pages/visitor-registration/visitor-registration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, DialogHostComponent],
  template: `
    <router-outlet></router-outlet> 
    <!-- Dialog host -->
    <app-dialog-host></app-dialog-host>
  `
})
export class AppComponent implements OnInit {
  
  constructor(private componentRegistry: ComponentRegistryService) {}
  
  ngOnInit() {
    this.componentRegistry.register('ActivityReport', ActivityReport);
    this.componentRegistry.register('ReportFilters', ReportFilters);
    this.componentRegistry.register('ReportDetailComponent', ReportDetailComponent);
    this.componentRegistry.register('VisitorRegistration', VisitorRegistrationComponent);
    
  }
}
