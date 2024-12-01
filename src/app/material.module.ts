import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatError, MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardActions, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule
  ],
  imports: []
})
export class MaterialModule { }
