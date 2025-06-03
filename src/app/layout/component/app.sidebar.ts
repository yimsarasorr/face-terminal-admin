import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, AppMenu],
    template: `
        <div class="layout-sidebar">
            <app-menu></app-menu>
        </div>
    `
})
export class AppSidebar implements AfterViewInit {
    constructor(public layoutService: LayoutService) {}

    ngAfterViewInit() {
        // Debug console logs to check menu structure
        setTimeout(() => {
            console.log('Checking menu structure...');
            const sidebar = document.querySelector('.layout-sidebar');
            console.log('Sidebar:', sidebar);
            
            const menuLinks = document.querySelectorAll('.menu-link');
            console.log('Menu links found:', menuLinks.length);
        }, 1000);
    }
}