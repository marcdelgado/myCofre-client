import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CredentialListComponent } from './components/credential-list/credential-list.component';
import { CredentialDetailComponent } from './components/credential-detail/credential-detail.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { HomeComponent } from "./components/home/home.component";
import { BrowserComponent } from "./components/browser/browser.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {MatCardActions, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatError, MatLabel} from "@angular/material/input";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        HomeComponent,
        CredentialListComponent,
        CredentialDetailComponent,
        CategoryListComponent,
        CategoryDetailComponent,
        HeaderComponent,
        FooterComponent,
        BrowserComponent,
        UserProfileComponent,
        ChangePasswordComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        FontAwesomeModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    providers: [
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
