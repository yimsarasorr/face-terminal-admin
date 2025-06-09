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
            <app-submenu [items]="items" [title]="title" [subtitle]="subtitle"></app-submenu>
        </div>
    `,
    styles: [`
        .submenu-sidebar {
            width: 250px;
            background-color: var(--surface-card);
            border-right: 1px solid var(--surface-border);
            height: 100vh;
            position: fixed;
            left: var(--sidebar-width);
            top: 0;
            z-index: 998;
            overflow-y: auto;
            padding-top: 1rem;
        }
    `]
})
export class AppSubmenuSidebar {
    @Input() items: any[] = [];
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() active: boolean = true;
}