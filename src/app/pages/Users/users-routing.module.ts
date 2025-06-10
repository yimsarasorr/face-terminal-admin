import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserListPage } from './pages/user-list.page';
import { Empty } from '../empty/empty';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      { path: 'list', component: UserListPage },
      // { path: 'add', component: UserAddPage },
      // { path: 'face', component: UserFacePage },
      // { path: 'card', component: UserCardPage },
      // { path: 'management', component: UserManagementPage },
      { path: '', component: Empty }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }