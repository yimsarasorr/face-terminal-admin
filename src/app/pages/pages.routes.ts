import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Users } from './Users/users';
import { Reports } from './reports/reports';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'reports', component: Reports },
    { path: 'users', component: Users },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
