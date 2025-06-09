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
        <!-- ลบ app-topbar ออกจากเทมเพลต -->
        <app-sidebar></app-sidebar>

        <!-- เพิ่ม submenu sidebar สำหรับหน้าที่ต้องการ -->
        <app-submenu-sidebar *ngIf="hasSubmenu()" 
            [items]="reportsSubmenuItems" 
            title="Reports" 
            subtitle="Analyze your data">
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

    // เพิ่มเมธอดสำหรับตรวจสอบ route
    checkRouteForSubmenu(url: string) {
        // ถ้าเป็นหน้า reports จะแสดง submenu
        this.hasSubmenu.set(url.includes('/reports'));
    }

    // ติดตามการเปลี่ยนแปลง route
    ngOnInit() {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            this.checkRouteForSubmenu(event.url);
        });
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
            'submenu-sidebar-active': this.hasSubmenu // เพิ่มคลาสสำหรับหน้าที่มี submenu
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
