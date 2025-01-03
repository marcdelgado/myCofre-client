import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChangePasswordForm} from "../../models/forms/change-password-form";
import {MatFormField} from "@angular/material/form-field";
import {catchError, concatMap, forkJoin, of} from "rxjs";
import {VaultService} from "../../services/vault.service";
import {AuthService} from "../../services/auth.service";
import {NavigationStateService} from "../../services/navigation-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});
  from: string = 'list';
  errorMessage: string | null = null;
  hidePassword_oldPassword = true;
  hidePassword_newPassword = true;
  hidePassword_confirmNewPassword = true;


  constructor(private fb: FormBuilder,
              private vaultService: VaultService,
              private authService: AuthService,
              private router: Router,
              private navigationStateService: NavigationStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.from = this.navigationStateService.getFromRoute();
  }

  private initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const formData: ChangePasswordForm = this.changePasswordForm.value;

      this.authService.changeRepassword(formData).pipe(
          concatMap(() => {
            console.log('Cambio de contraseña en AuthService exitoso, llamando a VaultService...');
            return this.vaultService.changePassword(formData.newPassword);
          }),
          catchError(err => {
            console.error('La contraseña no es correcta.', err.message);
            this.errorMessage = 'La contraseña no es correcta.';
            return of();
          })
      ).subscribe({
        next: () => {
          console.log('Contraseña actualizada y vault re-encriptado correctamente.');
          alert('¡Contraseña cambiada con éxito!');
          this.router.navigate(['/home']);
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

  onCancel(): void {
    // Redirigir a la ruta de origen
    const targetRoute = this.from === 'category-list' ? '/category-list' : '/home';
    this.router.navigate([targetRoute]).then(() => {});

    // Limpia el estado si no quieres que persista
    this.navigationStateService.clearFromRoute();
  }

  onInputChange() {
    this.errorMessage = null;
  }
}
