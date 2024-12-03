import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {UserProfileForm} from "../../models/forms/user-profile-form";
import {Router} from "@angular/router";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();

    // Cargar datos del usuario
    this.userService.getUserProfile().subscribe({
      next: (userForm: UserProfileForm) => {
        this.profileForm.patchValue(userForm);
      },
      error: (err: Error) => {
        console.error('Error al cargar los datos del usuario:', err.message);
        alert(`Error al cargar los datos: ${err.message}`);
      }
    });
  }

  private initializeForm(): void {
    // Configuración del formulario con validaciones
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = new UserProfileForm(
          this.profileForm.value.name,
          this.profileForm.value.surname,
          this.profileForm.value.email
      );

      this.userService.saveUserProfile(formData).subscribe({
        next: () => {
          alert('Datos guardados correctamente.');
          this.router.navigate(['/home']); // Redirige a la página principal
        },
        error: (err: Error) => {
          console.error('Error al guardar los datos del usuario:', err.message);
          alert(`Error al guardar los datos: ${err.message}`);
        }
      });
    } else {
      alert('El formulario contiene errores.');
    }
  }
}
