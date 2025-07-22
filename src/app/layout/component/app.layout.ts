import { Component, OnDestroy, OnInit, Renderer2, ViewChild, effect, signal, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';
import { AppSubmenuSidebar } from './app.submenu-sidebar';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppSidebar, RouterModule, AppSubmenuSidebar],
    template: `
        <div class="layout-wrapper" [ngClass]="containerClass">
            <app-sidebar></app-sidebar>
            
            <app-submenu-sidebar *ngIf="hasSubmenu()" 
                [items]="currentSubmenuItems" 
                [title]="currentSubmenuTitle" 
                [subtitle]="currentSubmenuSubtitle">
            </app-submenu-sidebar>
            
            <div class="layout-main-container" [ngClass]="{'has-submenu': hasSubmenu()}">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
            </div>

            <div class="layout-mask"></div>
        </div>
    `
})
export class AppLayout implements OnDestroy, OnInit, AfterViewInit {
    overlayMenuOpenSubscription: Subscription;
    menuOutsideClickListener: any;
    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    
    hasSubmenu = signal(false);
    
    currentSubmenuItems: MenuItem[] = [];
    currentSubmenuTitle: string = '';
    currentSubmenuSubtitle: string = '';

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.layoutService.setSlimMode();

        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.overlayMenuActive || state.staticMenuMobileActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });

        this.overlayMenuOpenSubscription = new Subscription();
    }
    
    ngOnInit() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.checkRouteForSubmenu(this.router.url);
            });
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
            this.checkRouteForSubmenu(this.router.url);
        }, 0);
    }
    
    checkRouteForSubmenu(url: string) {
        if (!this.appSidebar || !this.appSidebar.menuComponent) {
            return;
        }

        const activeMainMenu = this.appSidebar.menuComponent.mainMenuItems.find(item => 
            item.routerLink && url.startsWith(item.routerLink[0]) && item.items && item.items.length > 0
        );

        if (activeMainMenu) {
            this.hasSubmenu.set(true);
            this.currentSubmenuItems = activeMainMenu.items || [];
            this.currentSubmenuTitle = activeMainMenu.label || '';
            this.currentSubmenuSubtitle = `Manage ${activeMainMenu.label}`;
        } else {
            this.hasSubmenu.set(false);
            this.currentSubmenuItems = [];
            this.currentSubmenuTitle = '';
            this.currentSubmenuSubtitle = '';
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.layoutService.isMobile() && this.isOutsideClicked(event)) {
            this.hideMenu();
        }
    }

    isOutsideClicked(event: Event): boolean {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-topbar-menu-button'); 
        const eventTarget = event.target as Node;

        const isOutsideSidebar = !(sidebarEl && (sidebarEl.isSameNode(eventTarget) || sidebarEl.contains(eventTarget)));
        const isOutsideTopbarButton = !(topbarEl && (topbarEl.isSameNode(eventTarget) || topbarEl.contains(eventTarget)));

        return isOutsideSidebar && isOutsideTopbarButton;
    }

    hideMenu() {
        this.layoutService.hideMobileMenu();
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
            'submenu-sidebar-active': this.hasSubmenu()
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