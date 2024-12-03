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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup; // Grupo de control para el formulario
  isSubmitting: boolean = false; // Estado de envío
  errorMessage: string | null = null; // Mensaje de error en caso de fallo

  constructor(
      private fb: FormBuilder, // Servicio para construir formularios reactivos
      private userService: UserService, // Servicio para realizar la operación de registro
      private dialog: MatDialog,
      private router: Router,
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


  // Método para enviar el formulario
  onSubmit() {
    if (!this.signupForm.invalid) {


    this.isSubmitting = true; // Activar el estado de envío
    this.errorMessage = null; // Limpiar mensajes de error previos

    // Crear un objeto `SignupForm` con los valores del formulario
    const formValue = this.signupForm.value;
    const signupData = new SignupForm(formValue.name,formValue.surname, formValue.email, formValue.password);

    // Llamar al servicio de registro
    this.userService.signup(signupData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.afterSignup();
      },
      error: (err: Error) => {
        this.errorMessage = `Error al guardar los datos: ${err.message}`;
      }
    });
  } else {
      console.log(this.signupForm.errors); // Verificar errores a nivel de grupo
      console.log(this.signupForm.get('confirmPassword')?.errors); // Verificar errores específicos

      console.error('El formulario es inválido. Corrige los errores antes de enviar.');
  alert('El formulario contiene errores. Por favor, corrígelos antes de enviar.');
}
  }

  // Validador personalizado para verificar que las contraseñas coincidan
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
