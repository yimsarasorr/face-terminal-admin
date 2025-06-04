import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { LiveFeedWidget } from './components/livefeedwidget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RevenueStreamWidget, LiveFeedWidget],
    template: `
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
