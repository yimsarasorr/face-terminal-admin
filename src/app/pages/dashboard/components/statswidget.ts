import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stats-widget',
    standalone: true,
    imports: [CardModule, CommonModule],
    template: `
        <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <!-- Today's Visitors -->
            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm font-medium uppercase tracking-wide">Today's Visitors</div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-bold mt-2">{{ todayVisitors }}</div>
                    </div>
                    <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                        <i class="pi pi-users text-blue-500 text-2xl"></i>
                    </div>
                </div>
                <div class="flex items-center text-sm">
                    <span class="text-green-500 font-medium flex items-center">
                        <i class="pi pi-arrow-up text-xs mr-1"></i>
                        +12%
                    </span>
                    <span class="text-surface-500 dark:text-surface-400 ml-2">from yesterday</span>
                </div>
            </div>

            <!-- People Check-In -->
            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm font-medium uppercase tracking-wide">Check-In Today</div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-bold mt-2">{{ checkInToday }}</div>
                    </div>
                    <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                        <i class="pi pi-sign-in text-green-500 text-2xl"></i>
                    </div>
                </div>
                <div class="flex items-center text-sm">
                    <span class="text-green-500 font-medium flex items-center">
                        <i class="pi pi-arrow-up text-xs mr-1"></i>
                        +8%
                    </span>
                    <span class="text-surface-500 dark:text-surface-400 ml-2">from yesterday</span>
                </div>
            </div>

            <!-- People Check-Out -->
            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm font-medium uppercase tracking-wide">Check-Out Today</div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-bold mt-2">{{ checkOutToday }}</div>
                    </div>
                    <div class="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                        <i class="pi pi-sign-out text-orange-500 text-2xl"></i>
                    </div>
                </div>
                <div class="flex items-center text-sm">
                    <span class="text-orange-500 font-medium flex items-center">
                        <i class="pi pi-arrow-down text-xs mr-1"></i>
                        -5%
                    </span>
                    <span class="text-surface-500 dark:text-surface-400 ml-2">from yesterday</span>
                </div>
            </div>

            <!-- Total Users -->
            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm font-medium uppercase tracking-wide">Total Users</div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-bold mt-2">{{ totalUsers }}</div>
                    </div>
                    <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <i class="pi pi-user-plus text-purple-500 text-2xl"></i>
                    </div>
                </div>
                <div class="flex items-center text-sm">
                    <span class="text-green-500 font-medium flex items-center">
                        <i class="pi pi-arrow-up text-xs mr-1"></i>
                        +15
                    </span>
                    <span class="text-surface-500 dark:text-surface-400 ml-2">new this week</span>
                </div>
            </div>
        </div>
    `
})
export class StatsWidget {
    todayVisitors: number = 156;
    checkInToday: number = 142;
    checkOutToday: number = 128;
    totalUsers: number = 1247;
}
