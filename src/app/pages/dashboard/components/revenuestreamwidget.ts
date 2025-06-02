import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-revenue-stream-widget',
    standalone: true,
    imports: [CardModule, ChartModule, ButtonModule, CommonModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template pTemplate="header">
                <div class="flex items-center justify-between p-6 pb-0">
                    <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0">Access Trends</h3>
                    <div class="flex items-center gap-2">
                        <p-button 
                            label="Today" 
                            size="small"
                            [outlined]="selectedPeriod !== 'today'"
                            (onClick)="changePeriod('today')">
                        </p-button>
                        <p-button 
                            label="This Week" 
                            size="small"
                            [outlined]="selectedPeriod !== 'week'"
                            (onClick)="changePeriod('week')">
                        </p-button>
                    </div>
                </div>
            </ng-template>
            
            <div class="p-6 pt-0">
                <!-- Stats Summary -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">{{ currentPeriodVisits }}</div>
                        <div class="text-sm text-surface-500">This {{ selectedPeriod === 'today' ? 'Day' : 'Week' }}</div>
                    </div>
                    <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">{{ previousPeriodVisits }}</div>
                        <div class="text-sm text-surface-500">{{ selectedPeriod === 'today' ? 'Yesterday' : 'Last Week' }}</div>
                    </div>
                </div>

                <!-- Chart -->
                <p-chart 
                    type="line" 
                    [data]="chartData" 
                    [options]="chartOptions"
                    [style]="{'height': '300px'}">
                </p-chart>

                <!-- Legend -->
                <div class="flex items-center justify-center gap-6 mt-4">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-green-500 rounded"></div>
                        <span class="text-sm text-surface-600 dark:text-surface-400">Check In</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-blue-500 rounded"></div>
                        <span class="text-sm text-surface-600 dark:text-surface-400">Check Out</span>
                    </div>
                </div>
            </div>
        </p-card>
    `
})
export class RevenueStreamWidget implements OnInit {
    selectedPeriod: 'today' | 'week' = 'today';
    chartData: any;
    chartOptions: any;
    currentPeriodVisits: number = 156;
    previousPeriodVisits: number = 142;

    ngOnInit() {
        this.updateChart();
    }

    changePeriod(period: 'today' | 'week') {
        this.selectedPeriod = period;
        this.updateChart();
    }

    updateChart() {
        if (this.selectedPeriod === 'today') {
            this.chartData = {
                labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
                datasets: [
                    {
                        label: 'Check In',
                        data: [2, 15, 25, 18, 22, 8],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Check Out',
                        data: [1, 8, 20, 25, 30, 12],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            };
            this.currentPeriodVisits = 156;
            this.previousPeriodVisits = 142;
        } else {
            this.chartData = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Check In',
                        data: [45, 52, 48, 61, 55, 32, 28],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Check Out',
                        data: [42, 48, 45, 58, 52, 30, 25],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            };
            this.currentPeriodVisits = 321;
            this.previousPeriodVisits = 298;
        }

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        };
    }
}
