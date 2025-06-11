import { Component, Input, Output, EventEmitter, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ReportDetailComponent } from './report-detail.component';

@Component({
    selector: 'app-report-dialog',
    standalone: true,
    imports: [
        CommonModule, 
        DialogModule, 
        ButtonModule, 
        ReportDetailComponent
    ],
    template: `
        <p-dialog 
            [(visible)]="visible" 
            [modal]="true" 
            [style]="{width: '100vw', height: '100vh'}" 
            [contentStyle]="{height: 'calc(100vh - 145px)', overflow: 'auto'}" 
            [baseZIndex]="10000"
            [showHeader]="true"
            [draggable]="false"
            [resizable]="false"
            [closable]="true"
            styleClass="fullscreen-dialog"
            [header]="header"
            (onHide)="visibleChange.emit(false)">
            
            <ng-container *ngComponentOutlet="dialogComponent; inputs: dialogInputs"></ng-container>
            
            <ng-template pTemplate="footer">
                <button pButton label="Close" icon="pi pi-times" 
                    (click)="visible = false" 
                    class="p-button-text"></button>
                <button pButton label="Export Data" icon="pi pi-download" 
                    class="p-button-text"></button>
            </ng-template>
        </p-dialog>
        <app-report-detail style="display:none;"></app-report-detail>
    `,
    styles: [`
        :host ::ng-deep .fullscreen-dialog {
            margin: 0 !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
        }
        
        :host ::ng-deep .fullscreen-dialog .p-dialog-content {
            padding: 1.5rem;
        }
    `]
})
export class ReportDialogComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    
    @Input() header: string = 'Report Details';
    @Input() dialogComponent: Type<any> = ReportDetailComponent;
    @Input() dialogInputs: any = {};
}