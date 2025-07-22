import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '../service/layout.service';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, TooltipModule, RippleModule, AppMenuitem],
    template: `
        <div class="sidebar-content desktop-menu">
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
            
            <div class="bottom-menu-wrapper">
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
        </div>
        <div class="mobile-menu">
            <ul class="layout-menu">
                <ng-container *ngFor="let item of mobileModel; let i = index">
                    <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                    <li *ngIf="item.separator" class="menu-separator"></li>
                </ng-container>
            </ul>
        </div>
        `
})
export class AppMenu implements OnInit {
    mainMenuItems: MenuItem[] = [];
    bottomMenuItems: MenuItem[] = [];
    mobileModel: MenuItem[] = [];

    constructor(private layoutService: LayoutService) {}

    ngOnInit() {
        const usersSubmenuItems: MenuItem[] = [
            { label: 'User Management', icon: 'pi pi-user-edit', routerLink: ['/pages/users/management'] },
            { label: 'User List', icon: 'pi pi-list', routerLink: ['/pages/users/list'] },
            { label: 'Add User', icon: 'pi pi-user-plus', routerLink: ['/pages/users/add'] }
        ];

        const reportsSubmenuItems: MenuItem[] = [
            { label: 'Visitor Reports', icon: 'pi pi-chart-bar', routerLink: ['/pages/reports/visitors'] },
            { label: 'User Activity', icon: 'pi pi-users', routerLink: ['/pages/reports/activity'] },
            { label: 'System Logs', icon: 'pi pi-list', routerLink: ['/pages/reports/logs'] },
            { label: 'Export Data', icon: 'pi pi-download', routerLink: ['/pages/reports/export'] }
        ];

        this.mainMenuItems = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/']
            },
            {
                label: 'Users',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/pages/users'],
                items: usersSubmenuItems 
            },
            {
                label: 'Reports',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/pages/reports'],
                items: reportsSubmenuItems
            }
        ];
        
        this.bottomMenuItems = [
            { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['pages/settings'] },
            { label: 'Logout', icon: 'pi pi-fw pi-sign-out', routerLink: ['/auth/login'] }
        ];

        this.mobileModel = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Main Menu',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-users',
                        items: usersSubmenuItems
                    },
                    {
                        label: 'Reports',
                        icon: 'pi pi-fw pi-chart-bar',
                        items: reportsSubmenuItems
                    }
                ]
            },
            {
                label: 'System',
                items: this.bottomMenuItems
            }
        ];
    }
}