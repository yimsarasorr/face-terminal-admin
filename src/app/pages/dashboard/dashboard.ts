import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsWidget } from './components/statswidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { LiveFeedWidget } from './components/livefeedwidget';
import { PageHeader } from '../../layout/component/app.page-header';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        StatsWidget, 
        RevenueStreamWidget, 
        LiveFeedWidget,
        PageHeader,
        ButtonModule
    ],
    template: `
        <app-page-header title="Dashboard" subtitle="Welcome back, Admin">
        </app-page-header>
        
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            
            <div class="col-span-12 xl:col-span-4">
                <app-live-feed-widget />
            </div>
            
            <div class="col-span-12 xl:col-span-8">
                <app-revenue-stream-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
