import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Reports } from './reports/reports';
import { ReportFilters } from './reports/components/report-filters';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { 
        path: 'reports',
        component: Reports,
        children: [
            { path: '', component: Empty },
            { path: 'visitors', component: ReportFilters },
            { path: 'activity', component: Empty },
            { path: 'logs', component: Empty },
            { path: 'export', component: Empty }
        ]
    },
    { 
        path: 'users',
        loadChildren: () => import('./Users/users-routing.module').then(m => m.UsersRoutingModule)
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
