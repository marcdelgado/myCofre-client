import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignupForm} from "../../models/forms/signup-form";
import {UserService} from "../../services/user.service";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {concatMap, from} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {NotifyDialogComponent} from "../shared/notify-dialog/notify-dialog.component";
import {debugLog} from "../../services/shared.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private dialog: MatDialog,
      private router: Router,
      private translateService: TranslateService
  ) {
    // Inicializar el formulario con validaciones
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
        { validators: this.passwordsMatchValidator } );
  }


  onSubmit() {
    if (!this.signupForm.invalid) {


    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.signupForm.value;
    const language = this.translateService.currentLang;
    const signupData = new SignupForm(formValue.name,formValue.surname, formValue.email, formValue.password, language);
    this.userService.signup(signupData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.afterSignup();
      },
      error: (err: Error) => {
        this.errorMessage = `Error al guarerdar los datos: ${err.message}`;
      }
    });
  } else {
      console.log(this.signupForm.errors);
      console.log(this.signupForm.get('confirmPassword')?.errors);

      console.error('El formulario es inválido. Corrige los errores antes de enviar.');
  alert('El formulario contiene errores. Por favor, corrígelos antes de enviar.');
}
  }

  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('password')?.value;
    const confirmNewPassword = group.get('confirmPassword')?.value;
    console.log(newPassword + " " + confirmNewPassword);
    return newPassword === confirmNewPassword ? null : { passwordsDoNotMatch: true };
  }

  private afterSignup():void{
    const dialogRef = this.dialog.open(NotifyDialogComponent, {
      data: { message: 'En breves minutos recibirá por email un enlace de activación. Gracias.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('login');
    });

  }


}
