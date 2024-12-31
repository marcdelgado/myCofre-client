import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-request-delete',
  templateUrl: './request-delete.component.html',
  styleUrl: './request-delete.component.scss'
})
export class RequestDeleteComponent {
  email: string = '';

  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              private translateService: TranslateService) {}



  onSubmit(): void {
    const language = this.translateService.currentLang;
    this.userService.requestDelete(this.email, language).subscribe({
      next: () => this.showMessage('Solicitud de eliminación enviada correctamente.', 'success'),
      error: (err) => this.showMessage(err.message, 'error')
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error'
    });
  }

}
