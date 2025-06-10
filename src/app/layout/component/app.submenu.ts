import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-submenu',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <ul class="submenu-list">
            <li *ngFor="let item of items" class="submenu-item">
                <a [routerLink]="item.routerLink" routerLinkActive="active-menuitem" class="submenu-link">
                    <i [class]="item.icon" class="submenu-icon"></i>
                    <span class="submenu-text">{{ item.label }}</span>
                </a>
            </li>
        </ul>
    `,
    styles: [`
        .submenu-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .submenu-item {
            padding: 0;
        }
        
        .submenu-link {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            color: var(--text-color);
            transition: background-color 0.2s;
            text-decoration: none;
        }
        
        .submenu-link:hover {
            background-color: var(--surface-hover);
        }
        
        .submenu-icon {
            margin-right: 0.5rem;
            font-size: 1rem;
        }
        
        .active-menuitem {
            font-weight: 700;
            color: var(--primary-color);
        }
    `]
})
export class AppSubmenu {
    @Input() items: any[] = [];
    @Input() title: string = '';
    @Input() subtitle: string = '';
}