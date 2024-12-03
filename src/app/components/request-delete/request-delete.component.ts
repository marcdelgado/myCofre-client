import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-request-delete',
  templateUrl: './request-delete.component.html',
  styleUrl: './request-delete.component.scss'
})
export class RequestDeleteComponent {
  email: string = '';

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}

  onSubmit(): void {
    this.userService.requestDelete(this.email).subscribe({
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
