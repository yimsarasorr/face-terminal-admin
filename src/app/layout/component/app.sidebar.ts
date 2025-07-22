import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { AppMenu } from './app.menu';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, AppMenu, RouterModule],
    template: `
        <div class="layout-sidebar">
            <a routerLink="/home" class="sidebar-logo-link">
                <div class="sidebar-header">
                    <div class="logo-container">
                        <img src="assets/images/logo.png" alt="Logo" class="app-logo">
                    </div>
                </div>
            </a>
            <div class="sidebar-divider"></div>
            <app-menu></app-menu>
        </div>
    `
})
export class AppSidebar {
    @ViewChild(AppMenu) menuComponent!: AppMenu;

    constructor(public layoutService: LayoutService) {}
}