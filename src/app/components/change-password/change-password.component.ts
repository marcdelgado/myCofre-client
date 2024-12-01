import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChangePasswordForm} from "../../models/forms/change-password-form";
import {MatFormField} from "@angular/material/form-field";
import {catchError, concatMap, forkJoin, of} from "rxjs";
import {VaultService} from "../../services/vault.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,
              private vaultService: VaultService,
              private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const formData: ChangePasswordForm = this.changePasswordForm.value;

      // Ejecutar AuthService primero y luego VaultService secuencialmente
      this.authService.changeRepassword(formData).pipe(
          concatMap(() => {
            console.log('Cambio de contraseña en AuthService exitoso, llamando a VaultService...');
            return this.vaultService.changePassword(formData.newPassword);
          }),
          catchError(err => {
            console.error('Error durante el cambio de contraseña:', err.message);
            alert('Hubo un problema al cambiar la contraseña. Por favor, inténtalo de nuevo.');
            return of(); // Retorna un observable vacío para terminar la secuencia en caso de error
          })
      ).subscribe({
        next: () => {
          console.log('Contraseña actualizada y vault re-encriptado correctamente.');
          alert('¡Contraseña cambiada con éxito!');
          // Redirigir al usuario, si es necesario:
          // this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error inesperado durante el flujo:', err.message);
        }
      });
    } else {
      console.error('El formulario es inválido. Corrige los errores antes de enviar.');
      alert('El formulario contiene errores. Por favor, corrígelos antes de enviar.');
    }
  }
}
