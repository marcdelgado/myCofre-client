import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignupForm} from "../../models/forms/signup-form";
import {UserService} from "../../services/user.service";

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
      private userService: UserService // Servicio para realizar la operación de registro
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
        console.log('Usuario registrado exitosamente');
        // Redirige o muestra un mensaje de éxito según sea necesario
      },
      error: (err: Error) => {
        console.error('Error al guardar los datos del usuario:', err.message);
        alert(`Error al guardar los datos: ${err.message}`);
      }
    });
  } else {
  console.error('El formulario es inválido. Corrige los errores antes de enviar.');
  alert('El formulario contiene errores. Por favor, corrígelos antes de enviar.');
}
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('password')?.value;
    const confirmNewPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordsMismatch: true };
  }

}
