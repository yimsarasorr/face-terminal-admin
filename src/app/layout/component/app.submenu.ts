import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SubmenuItem {
    label: string;
    routerLink?: any[];
    icon?: string;
    command?: () => void;
    badge?: string;
    badgeClass?: string;
    disabled?: boolean;
}

@Component({
    selector: 'app-submenu',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="submenu-container">
        <div class="submenu-header" *ngIf="title">
            <h2 class="submenu-title">{{title}}</h2>
            <p class="submenu-subtitle" *ngIf="subtitle">{{subtitle}}</p>
        </div>
        <ul class="submenu-list">
            <li *ngFor="let item of items" class="submenu-item">
                <a [routerLink]="item.routerLink" 
                   routerLinkActive="active-submenu"
                   [routerLinkActiveOptions]="{exact: exactMatch}"
                   class="submenu-link"
                   [ngClass]="{'submenu-link-disabled': item.disabled}"
                   (click)="item.command && item.command()">
                    <i *ngIf="item.icon" [class]="item.icon" class="submenu-icon"></i>
                    <span class="submenu-label">{{item.label}}</span>
                    <span *ngIf="item.badge" class="submenu-badge" [ngClass]="item.badgeClass">{{item.badge}}</span>
                </a>
            </li>
        </ul>
    </div>
    `,
    styles: [`
        .submenu-container {
            background-color: var(--surface-card);
            border-radius: 8px;
            box-shadow: var(--card-shadow);
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .submenu-header {
            margin-bottom: 1rem;
            border-bottom: 1px solid var(--surface-border);
            padding-bottom: 0.5rem;
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
            margin: 0.25rem 0 0 0;
        }
        
        .submenu-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .submenu-item {
            margin: 0;
        }
        
        .submenu-link {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.2s;
            white-space: nowrap;
        }
        
        .submenu-link:hover {
            background-color: var(--surface-hover);
        }
        
        .active-submenu {
            background-color: var(--primary-color-lightest);
            font-weight: 500;
            color: var(--primary-color);
        }
        
        .active-submenu .submenu-icon {
            color: var(--primary-color);
        }
        
        .submenu-link-disabled {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .submenu-icon {
            margin-right: 0.5rem;
        }
        
        .submenu-badge {
            margin-left: 0.5rem;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            border-radius: 4px;
            background-color: var(--primary-color);
            color: var(--primary-color-text);
        }
    `]
})
export class AppSubmenu {
    @Input() items: SubmenuItem[] = [];
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() exactMatch: boolean = false;
}