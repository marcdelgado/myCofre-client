import {
  Component,
  OnInit,
  ElementRef,
  Optional,
  SkipSelf,
  ChangeDetectorRef,
  ChangeDetectionStrategy, ViewChild
} from '@angular/core';
import {CredentialDto} from "../../models/vault/credential-dto";
import {CategoryDto} from "../../models/vault/category-dto";
import {VaultService} from "../../services/vault.service";
import {HomeComponent} from "../home/home.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {NavigationStateService} from "../../services/navigation-state.service";
import {concatMap, from} from "rxjs";
import {Fontawesome} from "../shared/fontawesome";
import {debugLog} from "../../services/shared.service";

@Component({
  selector: 'app-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: ['./credential-list.component.scss']
})
export class CredentialListComponent extends Fontawesome implements OnInit {

  categories: CategoryDto[] = [];
  credentials: CredentialDto[] = [];

  form: FormGroup;
  selectedCredentials: Set<string> = new Set();
  displayedColumns: string[] = ['select', 'serviceName', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  currentView :string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private vaultService: VaultService,
              @Optional() @SkipSelf() private homeComponent: HomeComponent,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private navigationStateService: NavigationStateService) {
    super();
    this.form = this.fb.group({
      selectAll: [false]
    });
  }


  ngOnInit(): void {
    // Cargar credenciales desde VaultService
    this.vaultService.listAllCredentials().subscribe({
      next: (credentials: any[]) => {
        this.credentials = credentials;
        this.dataSource.data = this.credentials;
        debugLog(credentials);// Asignar las credenciales al dataSource
      },
      complete: () => {
        if (this.homeComponent) {
          this.currentView = "home"
        } else {
          this.currentView = "credential-list"
        }
      },
      error: (err: any) => {
        console.error('Error al cargar las credenciales:', err);
        alert('Ocurrió un error al cargar las credenciales. Por favor, intenta nuevamente.');
      }
    });
  }


  get selectAllControl() {
    return this.form.get('selectAll') as FormControl;
  }


  toggleSelect(id: string) {
    if (this.selectedCredentials.has(id)) {
      this.selectedCredentials.delete(id);
    } else {
      this.selectedCredentials.add(id);
    }
  }

  filter(categoryIds: string[]): void {
    this.vaultService.findCredentials(categoryIds,"").subscribe({
      next: (filteredCredentials) => {
        this.dataSource.data = filteredCredentials;
      },
      error: (err) => {
        console.error('Error filtering credentials:', err);
        // Manejo del error
      },
    });
  }



  selectAll() {
    this.dataSource.data.forEach((row: any) => (row.selected = true));
  }

  deselectAll() {
    this.dataSource.data.forEach((row: any) => (row.selected = false));
  }

  deleteSelected(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que deseas eliminar los elementos seleccionados?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Filtrar elementos seleccionados directamente desde el dataSource
        const selectedItems = this.dataSource.data.filter((item: any) => item.selected);
        const idsToDelete = selectedItems.map(item => item.id);

        if (idsToDelete.length === 0) {
          alert('No hay elementos seleccionados para eliminar.');
          return;
        }

        console.log('IDs a eliminar:', idsToDelete);

        from(idsToDelete).pipe(
          concatMap(id => this.vaultService.removeCredential(id)) // Llama a removeCredential() uno por uno
        ).subscribe({
          next: () => {
            // Actualizamos la tabla después de cada eliminación
            this.dataSource.data = this.dataSource.data.filter(
              (item: any) => !idsToDelete.includes(item.id)
            );
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al eliminar elementos:', err);
            alert('Ocurrió un error al eliminar algunos elementos.');
          },
          complete: () => {
            alert('Todos los elementos seleccionados han sido eliminados.');
          }
        });
      }
    });
  }

  editSelected() {
    if (this.selectedCredentials.size === 1) {
      const id = Array.from(this.selectedCredentials)[0];
      // Aquí llama a la función para editar o navegar a `credential-detail` con `id`
      this.viewDetails(id);
    }
  }

  addCredential() {
    // Configura la ruta de origen
    this.navigationStateService.setFromRoute(this.currentView);

    // Navega al formulario para crear una nueva credencial
    this.router.navigate(['/credential-detail'], {
      queryParams: { action: 'new' },
    });
  }

  copyPassword(id: string): void {
    // Busca la credencial por ID
    const credential = this.credentials.find(c => c.id === id);
    debugLog(id);
    debugLog(this.credentials);
    debugLog(credential);
    if (credential && credential.password) {
      // Copia al portapapeles
      navigator.clipboard.writeText(credential.password).then(() => {
        console.log('Contraseña copiada al portapapeles:', credential.password);
        alert('Contraseña copiada al portapapeles');
      }).catch(err => {
        console.error('Error al copiar la contraseña:', err);
        alert('No se pudo copiar la contraseña. Inténtalo de nuevo.');
      });
    } else {
      console.warn('No se encontró la credencial o no tiene contraseña.');
      alert('No se pudo encontrar la contraseña.');
    }
  }

  viewDetails(id: string) {
    // Configura la ruta de origen
    this.navigationStateService.setFromRoute(this.currentView);
    console.log(this.currentView);

    // Navega al detalle de la credencial
    this.router.navigate(['/credential-detail'], {
      queryParams: { action: 'edit', id: id },
    });
  }









  toggleSelectAll(event: any): void {
    const isChecked = event.checked;
    this.dataSource.data.forEach((row: any) => {
      row.selected = isChecked; // Marca o desmarca cada fila
      if (isChecked) {
        this.selectedCredentials.add(row.id); // Agrega el ID al conjunto de seleccionados
      } else {
        this.selectedCredentials.clear(); // Limpia el conjunto si se desmarca todo
      }
    });
  }

  toggleRowSelection(row: any): void {
    if (row.selected) {
      this.selectedCredentials.add(row.id);
    } else {
      this.selectedCredentials.delete(row.id);
    }
  }



  filterByWord(keyword: string): void {
    if (keyword && keyword.length>0) {
      this.vaultService.findCredentials([], keyword).subscribe({
        next: (filteredCredentials) => {
          this.dataSource.data = filteredCredentials; // Actualizamos el dataSource con los resultados
          console.log('Credenciales filtradas:', filteredCredentials);
        },
        error: (err) => {
          console.error('Error al filtrar credenciales:', err);
          alert('Ocurrió un error al buscar las credenciales.');
        }
      });
    } else {
      this.vaultService.listAllCredentials().subscribe({
        next: (filteredCredentials) => {
          this.dataSource.data = filteredCredentials; // Actualizamos el dataSource con los resultados
          console.log('Credenciales filtradas:', filteredCredentials);
        },
        error: (err) => {
          console.error('Error al filtrar credenciales:', err);
          alert('Ocurrió un error al buscar las credenciales.');
        }
      });
    }
  }
}

