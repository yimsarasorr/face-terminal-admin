import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
    <div class="page-header">
        <div class="page-header-content">
            <div class="page-header-left">
                <button 
                    class="p-button p-button-icon-only p-button-text p-button-plain mobile-menu-button layout-topbar-menu-button" 
                    (click)="onMenuToggle()">
                    <i class="pi pi-bars text-xl"></i>
                </button>
                <h1 class="page-title">{{title}}</h1>
                <p *ngIf="subtitle" class="page-subtitle">{{subtitle}}</p>
            </div>
            
            <div class="page-header-right">
                <ng-content></ng-content>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .page-header {
            background-color: var(--surface-card);
            height: 4.6rem;
            display: flex;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 990;
            width: calc(100% + 3rem);
            margin-left: -1.5rem;
            margin-right: -1.5rem;
            margin-top: -1.5rem;
            margin-bottom: 1.5rem;
            padding: 0 1.5rem;
            border-top: 1px solid var(--surface-border);
            border-bottom: 1px solid var(--surface-border);
            border-left: 1px solid var(--surface-border);
        }
        
        .page-header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .page-header-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .page-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--text-color);
            line-height: 1.5;
        }
        
        .page-subtitle {
            margin: 0;
            color: var(--text-color-secondary);
            font-size: 0.875rem;
        }

        .mobile-menu-button {
            display: none;
        }
        
        @media (max-width: 991px) {
            .mobile-menu-button {
                display: inline-flex;
            }

            .page-header-content {
                flex-direction: row;
                align-items: center;
            }
            
            .page-header {
                height: 4.6rem;
                padding: 0 1rem;
            }
            
            .page-subtitle {
                display: none;
            }
            
            .page-header-right {
                margin-top: 0;
            }
        }
    `]
})
export class PageHeader {
    @Input() title: string = '';
    @Input() subtitle: string = '';

    constructor(private layoutService: LayoutService) {}
    
    onMenuToggle() {
        this.layoutService.onMenuToggle();
    }
}