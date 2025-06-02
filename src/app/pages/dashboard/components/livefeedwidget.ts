import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

interface LiveActivity {
    id: string;
    name: string;
    action: 'in' | 'out';
    time: Date;
    isNew?: boolean;
}

@Component({
    selector: 'app-live-feed-widget',
    standalone: true,
    imports: [CardModule, ButtonModule, TagModule, AvatarModule, CommonModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template pTemplate="header">
                <div class="flex items-center justify-between p-6 pb-0">
                    <div class="flex items-center gap-3">
                        <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0">Live Feed</h3>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="text-sm text-surface-500">Recent Visits</span>
                        </div>
                    </div>
                    <p-button 
                        icon="pi pi-refresh" 
                        [text]="true" 
                        size="small"
                        severity="secondary">
                    </p-button>
                </div>
            </ng-template>
            
            <div class="p-6 pt-0">
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    <div 
                        *ngFor="let activity of liveActivities; trackBy: trackByActivity"
                        class="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700"
                        [ngClass]="{'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700': activity.isNew}">
                        
                        <!-- Left Side: Status Icon + User Info -->
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                            <!-- Status Icon -->
                            <div 
                                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                [ngClass]="activity.action === 'in' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'">
                                <i 
                                    class="text-sm"
                                    [ngClass]="activity.action === 'in' ? 'pi pi-sign-in text-green-600' : 'pi pi-sign-out text-orange-600'">
                                </i>
                            </div>

                            <!-- User Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium text-surface-900 dark:text-surface-0 truncate">{{ activity.name }}</span>
                                    <p-tag 
                                        [value]="activity.action === 'in' ? 'IN' : 'OUT'" 
                                        [severity]="activity.action === 'in' ? 'success' : 'warning'"
                                        styleClass="text-xs px-2 py-1 flex-shrink-0">
                                    </p-tag>
                                </div>
                            </div>
                        </div>

                        <!-- Right Side: Time -->
                        <div class="text-right flex-shrink-0 ml-3">
                            <div class="text-sm text-surface-500 dark:text-surface-400">
                                {{ getTimeAgo(activity.time) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="liveActivities.length === 0" class="text-center py-8">
                    <i class="pi pi-clock text-4xl text-surface-300 dark:text-surface-600 mb-3"></i>
                    <p class="text-surface-500 dark:text-surface-400">No recent activity</p>
                </div>
            </div>
        </p-card>
    `
})
export class LiveFeedWidget {
    liveActivities: LiveActivity[] = [
        {
            id: '1',
            name: 'Wit Sor',
            action: 'in',
            time: new Date(Date.now() - 30000), // 30 seconds
            isNew: true
        },
        {
            id: '2',
            name: 'A Ant',
            action: 'out',
            time: new Date(Date.now() - 120000), // 2 minutes
        },
        {
            id: '3',
            name: 'B Bird',
            action: 'in',
            time: new Date(Date.now() - 180000), // 3 minutes
        },
        {
            id: '4',
            name: 'C Cat',
            action: 'out',
            time: new Date(Date.now() - 240000), // 4 minutes
        },
        {
            id: '5',
            name: 'D Dog',
            action: 'in',
            time: new Date(Date.now() - 300000), // 5 minutes
        }
    ];

    trackByActivity(index: number, activity: LiveActivity): string {
        return activity.id;
    }

    getTimeAgo(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    }
}