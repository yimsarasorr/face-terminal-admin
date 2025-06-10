import { Component, OnDestroy, OnInit, Renderer2, ViewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';
import { AppSubmenuSidebar } from './app.submenu-sidebar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppSidebar, RouterModule, AppSubmenuSidebar],
    template: ` <div class="layout-wrapper" [ngClass]="containerClass">
        <app-sidebar></app-sidebar>
        <app-submenu-sidebar *ngIf="hasSubmenu()" 
            [items]="currentSubmenuItems" 
            [title]="currentSubmenuTitle" 
            [subtitle]="currentSubmenuSubtitle">
        </app-submenu-sidebar>
        
        <div class="layout-main-container" [ngClass]="{'has-submenu': hasSubmenu()}">
            <!-- Main content -->
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
        </div>
    </div>`
})
export class AppLayout implements OnDestroy, OnInit {
    overlayMenuOpenSubscription: Subscription;
    menuOutsideClickListener: any;
    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    
    hasSubmenu = signal(false);
    
    currentSubmenuItems: any[] = [];
    currentSubmenuTitle: string = '';
    currentSubmenuSubtitle: string = '';
    
    reportsSubmenuItems = [
        {
            label: 'Visitor Reports',
            icon: 'pi pi-chart-bar',
            routerLink: ['/pages/reports/visitors']
        },
        {
            label: 'User Activity',
            icon: 'pi pi-users',
            routerLink: ['/reports/activity']
        },
        {
            label: 'System Logs',
            icon: 'pi pi-list',
            routerLink: ['/reports/logs']
        },
        {
            label: 'Export Data',
            icon: 'pi pi-download',
            routerLink: ['/reports/export']
        }
    ];
    
    usersSubmenuItems = [
        {
            label: 'User Management',
            icon: 'pi pi-user-edit',
            routerLink: ['/pages/users/management']
        },
        {
            label: 'User List',
            icon: 'pi pi-list',
            routerLink: ['/pages/users/list']
        },
        {
            label: 'Add User',
            icon: 'pi pi-user-plus',
            routerLink: ['/pages/users/add']
        }
    ];

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.layoutService.setSlimMode();

        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.overlayMenuActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.layoutService.layoutState.update((prev) => ({ ...prev, staticMenuMobileActive: false }));
            }
        });

        this.overlayMenuOpenSubscription = new Subscription();
    }

    checkRouteForSubmenu(url: string) {
        if (url.includes('/reports')) {
            this.hasSubmenu.set(true);
            this.currentSubmenuItems = this.reportsSubmenuItems;
            this.currentSubmenuTitle = 'Reports';
            this.currentSubmenuSubtitle = 'Analyze your data';
        } 
        else if (url.includes('/users')) {
            this.hasSubmenu.set(true);
            this.currentSubmenuItems = this.usersSubmenuItems;
            this.currentSubmenuTitle = 'User Management';
            this.currentSubmenuSubtitle = 'Manage system users';
        }
        else {
            this.hasSubmenu.set(false);
        }
    }

    ngOnInit() {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
            this.checkRouteForSubmenu(event.url);
        });
        
        this.checkRouteForSubmenu(this.router.url);
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    get containerClass() {
        return {
            'layout-theme-light': !this.layoutService.isDarkTheme(),
            'layout-theme-dark': this.layoutService.isDarkTheme(),
            'layout-overlay': this.layoutService.isOverlay(),
            'layout-static': !this.layoutService.isOverlay(),
            'layout-static-active': !this.layoutService.layoutState().staticMenuDesktopInactive,
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive,
            'p-input-filled': true,
            'p-ripple-disabled': false,
            'layout-static-slim': true,
            'submenu-sidebar-active': this.hasSubmenu
        };
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
