import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DialogService } from '../../services/dialog.service';
import { ComponentRegistryService } from '../../services/component-registry.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-host',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [closable]="true"
      [showHeader]="showHeader"
      [styleClass]="fullscreen ? 'fullscreen-dialog' : ''"
      [ngClass]="{ 'no-footer': !showFooter }" 
      (onHide)="closeDialog()">
      
      <ng-template pTemplate="header">
        {{ title }}
      </ng-template>

      <ng-container *ngIf="component" [ngComponentOutlet]="component" [ngComponentOutletInputs]="inputs"></ng-container>
      
      <ng-template pTemplate="footer">
        <button pButton label="ปิด" icon="pi pi-times" 
          (click)="closeDialog()" 
          class="p-button-text"></button>
        <button *ngIf="exportEnabled" pButton label="ส่งออกข้อมูล" icon="pi pi-download" 
          (click)="exportData()" 
          class="p-button-text"></button>
      </ng-template>
    </p-dialog>
  `,
  styles: []
})
export class DialogHostComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  component: any = null;
  inputs: Record<string, any> = {};
  title: string = '';
  fullscreen: boolean = true;
  exportEnabled: boolean = false;
  showHeader: boolean = true;
  showFooter: boolean = true;
  
  private subscription = new Subscription();
  private dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);
  private componentRegistry = inject(ComponentRegistryService);
  
  ngOnInit() {
    // URL params subscription
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        if (params['dialog']) {
            const componentName = params['dialog'];
            if (this.componentRegistry.has(componentName)) {
                this.component = this.componentRegistry.get(componentName);
                this.title = params['title'] || componentName;
                const filteredParams = { ...params };
                delete filteredParams['dialog'];
                delete filteredParams['title'];
                Object.keys(filteredParams).forEach(key => {
                    if (typeof filteredParams[key] === 'string' && (filteredParams[key].startsWith('{') || filteredParams[key].startsWith('['))) {
                        try { filteredParams[key] = JSON.parse(filteredParams[key]); } catch (e) { console.warn(`Failed to parse JSON for param: ${key}`); }
                    }
                });
                this.inputs = filteredParams;
                this.fullscreen = params['fullscreen'] !== 'false';
                this.exportEnabled = params['exportEnabled'] === 'true';
                this.showHeader = true; // URL-based dialogs always show header/footer by default
                this.showFooter = true;
                this.visible = true;
            }
        }
      })
    );
    
    // Service-based subscription
    this.subscription.add(
      this.dialogService.dialogState$.subscribe(state => {
        if (state.isOpen && state.config) {
          if (typeof state.config.component === 'string') {
            this.component = this.componentRegistry.get(state.config.component);
          } else {
            this.component = state.config.component;
          }
          this.inputs = state.config.inputs || {};
          this.title = state.config.title || '';
          this.fullscreen = state.config.fullscreen ?? true;
          this.exportEnabled = this.inputs['exportEnabled'] === true;
          this.showHeader = state.config.showHeader ?? true;
          this.showFooter = state.config.showFooter ?? true;
          this.visible = true;
        } else {
          this.visible = false;
        }
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  closeDialog() {
    this.dialogService.close();
  }
  
  exportData() {
    // Logic for exporting data
  }
}