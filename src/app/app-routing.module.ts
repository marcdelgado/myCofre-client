import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {CredentialListComponent} from "./components/credential-list/credential-list.component";
import {CredentialDetailComponent} from "./components/credential-detail/credential-detail.component";
import {CategoryListComponent} from "./components/category-list/category-list.component";
import {CategoryDetailComponent} from "./components/category-detail/category-detail.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'credential-list', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'credential-list',
    component: CredentialListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'credential/:id',
    component: CredentialDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category-list',
    component: CategoryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/:id',
    component: CategoryDetailComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
