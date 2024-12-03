import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  email: string = '';
  token: string = '';
  loading: boolean = true;
  message: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (this.email && this.token) {
      this.userService.delete(this.email, this.token).subscribe({
        next: () => {
          this.message = 'Cuenta eliminada correctamente.';
          this.loading = false;
        },
        error: (err) => {
          this.message = `Error: ${err.message}`;
          this.loading = false;
        }
      });
    } else {
      this.message = 'Información incompleta en el enlace.';
      this.loading = false;
    }
  }
}
