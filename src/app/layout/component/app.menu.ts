import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, TooltipModule, RippleModule],
    template: `
    <ul class="layout-menu layout-menu-slim">
        <li *ngFor="let item of model" class="menu-item">
            <a 
               [routerLink]="item.routerLink" 
               routerLinkActive="active-route" 
               [routerLinkActiveOptions]="{exact: true}"
               class="menu-link"
               [pTooltip]="item.label"
               tooltipPosition="right"
               pRipple>
                <i [class]="item.icon" class="menu-icon"></i>
                <span class="menu-badge" *ngIf="item.badge">{{item.badge}}</span>
            </a>
        </li>
    </ul>
    `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/']
            },
            {
                label: 'UI Components',
                icon: 'pi pi-fw pi-box',
                routerLink: ['/uikit']
            },
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: ['/pages/dashboard']
            },
            {
                label: 'Forms',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/uikit/formlayout']
            },
            {
                label: 'Tables',
                icon: 'pi pi-fw pi-table',
                routerLink: ['/uikit/table']
            },
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/pages/settings']
            }
        ];
    }
}
