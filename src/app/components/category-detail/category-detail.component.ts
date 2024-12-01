import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {VaultService} from "../../services/vault.service";
import {NavigationStateService} from "../../services/navigation-state.service";
import {CredentialDto} from "../../models/vault/credential-dto";
import {CategoryDto} from "../../models/vault/category-dto";

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent {
  categoryForm!: FormGroup;
  credentials: Array<{ id: string, serviceName: string }> = [];
  action: 'edit' | 'new' = 'new';
  categoryId?: string;
  from: string = 'list';

  constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private vaultService: VaultService,
      private router: Router,
      private navigationStateService: NavigationStateService
  ) {}

  ngOnInit(): void {
    // Inicialización del formulario
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      credentials: [[]]
    });

    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'new';
      this.categoryId = params['id'];
      if (this.action === 'edit' && this.categoryId) {
        this.loadCategory(this.categoryId);
      }
    });

    // Cargar credenciales
    this.loadCredentials();

    // Recuperar la ruta de origen desde el servicio
    this.from = this.navigationStateService.getFromRoute();
  }

  loadCredentials(): void {
    this.vaultService.listAllCredentials().subscribe({
      next: (credentials) => {
        this.credentials = credentials;
      },
      error: (err) => {
        console.error('Error al cargar las categorías:', err);
        alert('Ocurrió un error al cargar las categorías. Por favor, intenta nuevamente.');
      }
    });
  }

  loadCategory(id: string): void {
    this.vaultService.getCategory(id).subscribe({
      next: (category) => {
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            credentials: category.credentials
          });
        } else {
          console.warn('No se encontró ninguna categoría con el ID proporcionado:', id);
        }
      },
      error: (err) => {
        console.error('Error al cargar la categoría:', err);
        alert('Ocurrió un error al cargar la categoría. Por favor, intenta nuevamente.');
      }
    });
  }
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData: CategoryDto = new CategoryDto(
          this.categoryForm.value.name,
          this.categoryForm.value.categories || [],
          this.categoryForm.value.id || ""
      );
      let actionObservable;

      if (this.action === 'new') {
        actionObservable = this.vaultService.addCategory(categoryData); // Retorna un observable
      } else if (this.action === 'edit' && this.categoryId) {
        console.log('Editando categoría...');
        actionObservable = this.vaultService.updateCategory(categoryData); // Retorna un observable
      }

      if (actionObservable) {
        actionObservable.subscribe({
          next: () => {
            // Redirigir tras guardar exitosamente
            const targetRoute = this.from === 'category-list' ? '/category-list' : '/home';
            this.router.navigate([targetRoute]).then(() => {
              console.log('Navegación completada.');
            });
          },
          error: (err) => {
            console.error('Error al guardar la categoría:', err);
            alert('Ocurrió un error al guardar la categoría. Por favor, intenta de nuevo.');
          }
        });
      }
    }
  }

  onCancel(): void {
    // Redirigir a la ruta de origen
    const targetRoute = this.from === 'category-list' ? '/category-list' : '/home';
    this.router.navigate([targetRoute]).then(() => {});

    // Limpia el estado si no quieres que persista
    this.navigationStateService.clearFromRoute();
  }

}
