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
    <div class="sidebar-content">
        <!-- กลุ่มเมนูหลัก -->
        <ul class="layout-menu layout-menu-slim">
            <li *ngFor="let item of mainMenuItems" class="menu-item">
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
        
        <!-- กลุ่มเมนูด้านล่าง -->
        <ul class="layout-menu layout-menu-slim bottom-menu">
            <li *ngFor="let item of bottomMenuItems" class="menu-item">
                <a 
                   [routerLink]="item.routerLink" 
                   routerLinkActive="active-route" 
                   [routerLinkActiveOptions]="{exact: true}"
                   class="menu-link"
                   [pTooltip]="item.label"
                   tooltipPosition="right"
                   pRipple>
                    <i [class]="item.icon" class="menu-icon"></i>
                </a>
            </li>
        </ul>
    </div>
    `
})
export class AppMenu implements OnInit {
    mainMenuItems: MenuItem[] = [];
    bottomMenuItems: MenuItem[] = [];

    ngOnInit() {
        this.mainMenuItems = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/']
            },
            {
                label: 'Users',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/users']
            },
            {
                label: 'Reports',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/reports']
            }
        ];
        
        this.bottomMenuItems = [
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/settings']
            },
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                routerLink: ['/auth/login']
            }
        ];
    }
}
