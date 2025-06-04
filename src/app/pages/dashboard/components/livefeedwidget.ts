import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

interface LiveActivity {
    id: string;
    name: string;
    action: 'in' | 'out';
    time: Date;
    deviceId: string;
    deviceName: string;
    deviceLocation?: string; // เพิ่มสถานที่
    isNew?: boolean;
}

@Component({
    selector: 'app-live-feed-widget',
    standalone: true,
    imports: [CardModule, ButtonModule, TagModule, AvatarModule, CommonModule, DropdownModule, FormsModule],
    template: `
    <p-card styleClass="h-full">
        <ng-template pTemplate="header">
            <div class="flex items-center justify-between p-6 pb-0">
                <div class="flex items-center gap-3">
                    <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0">Live Activity</h3>
                </div>
                <div class="flex items-center gap-2">
                    <!-- Device Filter Dropdown -->
                    <p-dropdown 
                        [options]="deviceOptions"
                        [(ngModel)]="selectedDevice" 
                        optionLabel="name"
                        placeholder="All Devices"
                        styleClass="text-sm"
                        (onChange)="filterActivitiesByDevice()">
                    </p-dropdown>
                    
                    <p-button 
                        icon="pi pi-refresh" 
                        [text]="true" 
                        size="small"
                        severity="secondary"
                        (onClick)="refreshActivities()">
                    </p-button>
                </div>
            </div>
        </ng-template>
        
        <div class="p-6 pt-0">
            <div class="space-y-3 max-h-96 overflow-y-auto">
                <div 
                    *ngFor="let activity of filteredActivities; trackBy: trackByActivity"
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
                        <div class="flex-1 min-w-0 flex flex-col">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-surface-900 dark:text-surface-0 truncate">{{ activity.name }}</span>
                                <p-tag 
                                    [value]="activity.action === 'in' ? 'IN' : 'OUT'" 
                                    [severity]="activity.action === 'in' ? 'success' : 'warning'"
                                    styleClass="text-xs px-2 py-1 flex-shrink-0">
                                </p-tag>
                            </div>
                            <!-- Device Location Info -->
                            <div class="text-sm text-surface-500">
                                {{ activity.deviceName }} 
                                <span *ngIf="activity.deviceLocation">({{ activity.deviceLocation }})</span>
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
            <div *ngIf="filteredActivities.length === 0" class="text-center py-8">
                <i class="pi pi-clock text-4xl text-surface-300 dark:text-surface-600 mb-3"></i>
                <p class="text-surface-500 dark:text-surface-400">
                    {{ selectedDevice?.id ? 'No activity for this device' : 'No recent activity' }}
                </p>
            </div>
        </div>
    </p-card>
`
})
export class LiveFeedWidget implements OnInit {
    liveActivities: LiveActivity[] = [];
    filteredActivities: LiveActivity[] = [];
    deviceOptions: {id: string, name: string}[] = [];
    selectedDevice: {id: string, name: string} | null = null;

    ngOnInit() {
        this.deviceOptions = [
            { id: 'all', name: 'All Devices' },
            { id: 'device1', name: 'Main Entrance' },
            { id: 'device2', name: 'Staff Entrance' },
            { id: 'device3', name: 'VIP Gate' },
            { id: 'device4', name: 'Back Door' }
        ];
        
        this.liveActivities = [
            {
                id: '1',
                name: 'Wit Sor',
                action: 'in',
                time: new Date(Date.now() - 30000),
                deviceId: 'device1',
                deviceName: 'Main Entrance',
                deviceLocation: 'Building A'
            },
            {
                id: '2',
                name: 'A Ant',
                action: 'out',
                time: new Date(Date.now() - 120000),
                deviceId: 'device2',
                deviceName: 'Staff Entrance',
                deviceLocation: 'Building B'
            },
            {
                id: '3',
                name: 'B Bird',
                action: 'in',
                time: new Date(Date.now() - 180000),
                deviceId: 'device3', 
                deviceName: 'VIP Gate',
                deviceLocation: 'Building A'
            },
            {
                id: '4',
                name: 'C Cat',
                action: 'out',
                time: new Date(Date.now() - 240000),
                deviceId: 'device1',
                deviceName: 'Main Entrance',
                deviceLocation: 'Building A'
            },
            {
                id: '5',
                name: 'D Dog',
                action: 'in',
                time: new Date(Date.now() - 300000),
                deviceId: 'device4',
                deviceName: 'Back Door',
                deviceLocation: 'Building C'
            },
            {
                id: '6',
                name: 'F Fish',
                action: 'out',
                time: new Date(Date.now() - 360000),
                deviceId: 'device1',
                deviceName: 'Main Entrance',
                deviceLocation: 'Building A'
            }
        ];
        
        this.filteredActivities = [...this.liveActivities];
    }
    
    filterActivitiesByDevice() {
        if (!this.selectedDevice || this.selectedDevice.id === 'all') {
            this.filteredActivities = [...this.liveActivities];
        } else {
            this.filteredActivities = this.liveActivities.filter(
                activity => activity.deviceId === this.selectedDevice?.id
            );
        }
    }
    
    refreshActivities() {
        this.loadActivities();
    }
    
    loadActivities() {
        this.filterActivitiesByDevice();
    }

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