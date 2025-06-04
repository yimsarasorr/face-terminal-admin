import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

interface DeviceStats {
    deviceId: string;
    deviceName: string;
    deviceLocation: string;
    checkIn: number;
    checkOut: number;
    total: number;
    status: 'active' | 'inactive' | 'maintenance';
}

@Component({
    selector: 'app-revenue-stream-widget',
    standalone: true,
    imports: [CardModule, ChartModule, ButtonModule, CommonModule, TableModule, TagModule, SelectButtonModule, FormsModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template pTemplate="header">
                <div class="flex items-center justify-between p-6 pb-0">
                    <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0">Device Access Report</h3>
                    <div class="flex items-center gap-2">
                        <p-selectButton [options]="viewOptions" [(ngModel)]="selectedView" optionLabel="label" optionValue="value"></p-selectButton>
                    </div>
                </div>
            </ng-template>
            
            <div class="p-6 pt-0">
                <!-- Summary Statistics -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">{{ totalCheckIn }}</div>
                        <div class="text-sm text-surface-500">Total Check In</div>
                    </div>
                    <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="text-2xl font-bold text-orange-600">{{ totalCheckOut }}</div>
                        <div class="text-sm text-surface-500">Total Check Out</div>
                    </div>
                    <div class="text-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600">{{ totalDevices }}</div>
                        <div class="text-sm text-surface-500">Active Devices</div>
                    </div>
                </div>

                <!-- Table View -->
                <div *ngIf="selectedView === 'table'" class="mt-4">
                    <p-table [value]="deviceStats" [paginator]="true" [rows]="5" 
                             styleClass="p-datatable-sm p-datatable-gridlines"
                             [tableStyle]="{'min-width': '50rem'}">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Device Name</th>
                                <th>Location</th>
                                <th class="text-center">Check In</th>
                                <th class="text-center">Check Out</th>
                                <th class="text-center">Total</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-device>
                            <tr>
                                <td>{{ device.deviceName }}</td>
                                <td>{{ device.deviceLocation }}</td>
                                <td class="text-center">
                                    <span class="text-green-600 font-medium">{{ device.checkIn }}</span>
                                </td>
                                <td class="text-center">
                                    <span class="text-blue-600 font-medium">{{ device.checkOut }}</span>
                                </td>
                                <td class="text-center font-bold">{{ device.total }}</td>
                                <td class="text-center">
                                    <p-tag 
                                        [value]="getStatusLabel(device.status)" 
                                        [severity]="getStatusSeverity(device.status)">
                                    </p-tag>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>

                <!-- Chart View -->
                <div *ngIf="selectedView === 'chart'" class="mt-4">
                    <p-chart type="bar" [data]="chartData" [options]="chartOptions" height="300px"></p-chart>
                </div>
            </div>
        </p-card>
    `
})
export class RevenueStreamWidget implements OnInit {
    selectedView: 'table' | 'chart' = 'chart';
    viewOptions = [
        { label: 'Table', value: 'table' },
        { label: 'Chart', value: 'chart' }
    ];
    
    deviceStats: DeviceStats[] = [];
    totalCheckIn: number = 0;
    totalCheckOut: number = 0;
    totalDevices: number = 0;
    
    chartData: any;
    chartOptions: any;

    ngOnInit() {
        this.loadDeviceStats();
        this.prepareChartData();
    }

    loadDeviceStats() {
        this.deviceStats = [
            {
                deviceId: 'device1',
                deviceName: 'Main Entrance',
                deviceLocation: 'Building A',
                checkIn: 156,
                checkOut: 142,
                total: 298,
                status: 'active'
            },
            {
                deviceId: 'device2',
                deviceName: 'Staff Entrance',
                deviceLocation: 'Building B',
                checkIn: 89,
                checkOut: 85,
                total: 174,
                status: 'active'
            },
            {
                deviceId: 'device3',
                deviceName: 'VIP Gate',
                deviceLocation: 'Building A',
                checkIn: 45,
                checkOut: 40,
                total: 85,
                status: 'active'
            },
            {
                deviceId: 'device4',
                deviceName: 'Back Door',
                deviceLocation: 'Building C',
                checkIn: 32,
                checkOut: 28,
                total: 60,
                status: 'active'
            },
            {
                deviceId: 'device5',
                deviceName: 'Delivery Entrance',
                deviceLocation: 'Building C',
                checkIn: 18,
                checkOut: 16,
                total: 34,
                status: 'active'
            },
            {
                deviceId: 'device6',
                deviceName: 'Emergency Exit',
                deviceLocation: 'Building B',
                checkIn: 5,
                checkOut: 5,
                total: 10,
                status: 'maintenance'
            },
            {
                deviceId: 'device7',
                deviceName: 'Side Entrance',
                deviceLocation: 'Building A',
                checkIn: 0,
                checkOut: 0,
                total: 0,
                status: 'inactive'
            }
        ];
        
        this.totalCheckIn = this.deviceStats.reduce((sum, device) => sum + device.checkIn, 0);
        this.totalCheckOut = this.deviceStats.reduce((sum, device) => sum + device.checkOut, 0);
        this.totalDevices = this.deviceStats.filter(device => device.status === 'active').length;
    }
    
    prepareChartData() {
        const deviceNames = this.deviceStats.map(device => device.deviceName);
        const checkInData = this.deviceStats.map(device => device.checkIn);
        const checkOutData = this.deviceStats.map(device => device.checkOut);
        
        this.chartData = {
            labels: deviceNames,
            datasets: [
                {
                    label: 'Check In',
                    backgroundColor: '#10b981',
                    data: checkInData
                },
                {
                    label: 'Check Out',
                    backgroundColor: '#3b82f6',
                    data: checkOutData
                }
            ]
        };
        
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(160, 160, 160, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        };
    }
    
    getStatusLabel(status: string): string {
        switch(status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'maintenance': return 'Maintenance';
            default: return status;
        }
    }
    
    getStatusSeverity(status: string): string {
        switch(status) {
            case 'active': return 'success';
            case 'inactive': return 'danger';
            case 'maintenance': return 'warning';
            default: return 'info';
        }
    }
}
