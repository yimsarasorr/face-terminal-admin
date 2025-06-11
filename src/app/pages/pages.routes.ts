import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Reports } from './reports/reports';
import { ReportFilters } from './reports/components/report-filters';
import { ActivityReport } from './reports/components/activity-report';
import { LogsReport } from './reports/components/logs-report';
import { Settings } from './settings/settings';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'settings', component: Settings },
    { 
        path: 'reports',
        component: Reports,
        children: [
            { path: '', component: Empty },
            { path: 'visitors', component: ReportFilters },
            { path: 'activity', component: ActivityReport },
            { path: 'logs', component: LogsReport },
            { path: 'export', component: Empty }
        ]
    },
    { 
        path: 'users',
        loadChildren: () => import('./Users/users-routing.module').then(m => m.UsersRoutingModule)
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
