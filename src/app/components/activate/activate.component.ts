import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent {
  token: string | null = null;
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.email && this.token) {
      this.activateAccount(this.email, this.token);
    } else {
      this.showMessage('Token inválido.', 'error');
    }
  }

  activateAccount(email:string, token: string): void {
    this.userService.activate(email, token).subscribe({
      next: () => this.showMessage('OK, cuenta activada.', 'success'),
      error: () => this.showMessage('Hubo un problema al activar.', 'error')
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const config = {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error'
    };
    this.snackBar.open(message, 'Cerrar', config);
  }
}
