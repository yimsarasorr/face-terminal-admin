import { Component } from '@angular/core';
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
            <app-menu></app-menu>
        </div>
    `
})
export class AppSidebar {
    constructor(public layoutService: LayoutService) {}
}