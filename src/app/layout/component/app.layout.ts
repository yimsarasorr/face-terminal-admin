import { Component, OnDestroy, Renderer2, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter],
    template: `
    <div class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-content-wrapper">
            <app-sidebar></app-sidebar>
            <div class="layout-main-container">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
                <app-footer></app-footer>
            </div>
        </div>
        <div class="layout-mask" (click)="hideMenu()"></div>
    </div>`
})
export class AppLayout implements OnDestroy {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

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
            'layout-static-slim': true
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
