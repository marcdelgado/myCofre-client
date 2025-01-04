
import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-notify-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './notify-dialog.component.html',
  styleUrl: './notify-dialog.component.scss'
})
export class NotifyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
