import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {CredentialListComponent} from "./components/credential-list/credential-list.component";
import {CredentialDetailComponent} from "./components/credential-detail/credential-detail.component";
import {CategoryListComponent} from "./components/category-list/category-list.component";
import {CategoryDetailComponent} from "./components/category-detail/category-detail.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', pathMatch: 'full'
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
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'credential-list',
    component: CredentialListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'credential-detail',
    component: CredentialDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category-list',
    component: CategoryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category-detail',
    component: CategoryDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
