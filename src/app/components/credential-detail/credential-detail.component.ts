import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {VaultService} from "../../services/vault.service";
import {NavigationStateService} from "../../services/navigation-state.service";
import {CredentialDto} from "../../models/vault/credential-dto";

@Component({
  selector: 'app-credential-detail',
  templateUrl: './credential-detail.component.html',
  styleUrls: ['./credential-detail.component.scss']
})
export class CredentialDetailComponent implements OnInit {
  credentialForm!: FormGroup;
  categories: Array<{ id: string, name: string }> = [];
  action: 'edit' | 'new' = 'new';
  credentialId?: string;
  from: string = 'list';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vaultService: VaultService,
    private router: Router,
    private navigationStateService: NavigationStateService
  ) {}

  ngOnInit(): void {
    this.credentialForm = this.fb.group({
      serviceName: ['', Validators.required],
      serviceUrl: [''],
      username: [''],
      password: ['', Validators.required],
      categories: [[]]
    });
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'new';
      this.credentialId = params['id'];
      if (this.action === 'edit' && this.credentialId) {
        this.loadCredential(this.credentialId);
      }
    });
    this.loadCategories();
    this.selectedCategories = [...this.credentialForm.value.categories];
    this.from = this.navigationStateService.getFromRoute();
  }

  loadCategories(): void {
    this.vaultService.listAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error al cargar las categorías:', err);
        alert('Ocurrió un error al cargar las categorías. Por favor, intenta nuevamente.');
      }
    });
  }

  loadCredential(id: string): void {
    this.vaultService.getCredential(id).subscribe({
      next: (credential) => {
        if (credential) {
          this.credentialForm.patchValue({
            serviceName: credential.serviceName,
            serviceUrl: credential.serviceUrl,
            username: credential.username,
            password: credential.password,
            categories: credential.categories
          });
        } else {
          console.warn('No se encontró ninguna credencial con el ID proporcionado:', id);
        }
      },
      error: (err) => {
        console.error('Error al cargar la credencial:', err);
        alert('Ocurrió un error al cargar la credencial. Por favor, intenta nuevamente.');
      }
    });
  }
  onSubmit(): void {
    if (this.credentialForm.valid) {
      const credentialData: CredentialDto = new CredentialDto(
        this.credentialForm.value.serviceName,
        this.credentialForm.value.serviceUrl,
        this.credentialForm.value.username,
        this.credentialForm.value.password,
        this.credentialForm.value.categories || [],
        this.credentialId || ""
      );
      let actionObservable;

      if (this.action === 'new') {
        actionObservable = this.vaultService.addCredential(credentialData); // Retorna un observable
      } else if (this.action === 'edit' && this.credentialId) {
        console.log('Editando credencial...');
        actionObservable = this.vaultService.updateCredential(credentialData); // Retorna un observable
      }

      if (actionObservable) {
        actionObservable.subscribe({
          next: () => {
            const targetRoute = this.from === 'credential-list' ? '/credential-list' : '/home';
            this.router.navigate([targetRoute]).then(() => {
              console.log('Navegación completada.');
            });
          },
          error: (err) => {
            console.error('Error al guardar la credencial:', err);
            alert('Ocurrió un error al guardar la credencial.');
          }
        });
      }
    }
  }

  onCancel(): void {
    const targetRoute = this.from === 'credential-list' ? '/credential-list' : '/home';
    this.router.navigate([targetRoute]).then(() => {});
    this.navigationStateService.clearFromRoute();
  }


  selectedCategories: string[] = [];

  toggleCategorySelection(categoryId: string): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
    // Actualiza el control de formulario
    this.credentialForm.get('categories')?.setValue([...this.selectedCategories]);

  }

}
