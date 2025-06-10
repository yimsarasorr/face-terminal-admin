import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppSubmenu } from './app.submenu';

@Component({
    selector: 'app-submenu-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, AppSubmenu],
    template: `
        <div class="submenu-sidebar" [ngClass]="{'submenu-sidebar-active': active}">
            <div class="submenu-header">
                <h2 class="submenu-title">{{ title }}</h2>
                <p class="submenu-subtitle">{{ subtitle }}</p>
            </div>
            
            <app-submenu [items]="items" [title]="title" [subtitle]="subtitle"></app-submenu>
        </div>
    `,
    styles: [`
        .submenu-sidebar {
            width: 250px;
            background-color: var(--surface-card);
            border-right: 1px solid var(--surface-border);
            border-left: 1px solid var(--surface-border);
            height: 100vh;
            position: fixed;
            left: var(--sidebar-width);
            top: 0;
            z-index: 998;
            overflow-y: auto;
        }
        
        .submenu-header {
            padding: 0.4rem 1.5rem;
            border-bottom: 1px solid var(--surface-border);
            margin-bottom: 1rem;
        }
        
        .submenu-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
            color: var(--text-color);
        }
        
        .submenu-subtitle {
            font-size: 0.875rem;
            color: var(--text-color-secondary);
            margin: 0.5rem 0 0;
        }
    `]
})
export class AppSubmenuSidebar {
    @Input() items: any[] = [];
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() active: boolean = true;
}