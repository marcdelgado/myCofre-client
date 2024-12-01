import {ChangeDetectorRef, Component, EventEmitter, Optional, Output, SkipSelf, ViewChild} from '@angular/core';
import {VaultService} from "../../services/vault.service";
import {CategoryDto} from "../../models/vault/category-dto";
import {MatTableDataSource} from "@angular/material/table";
import {MatSelectionListChange} from "@angular/material/list";
import {HomeComponent} from "../home/home.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {NavigationStateService} from "../../services/navigation-state.service";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {concatMap, from} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {

  form: FormGroup;
  selectedCategories: Set<string> = new Set();
  displayedColumns: string[] = ['select', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  currentView :string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() filterChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private vaultService: VaultService,
              @Optional() @SkipSelf() private homeComponent: HomeComponent,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private navigationStateService: NavigationStateService) {
    this.form = this.fb.group({
      selectAll: [false]
    });
  }


  ngOnInit(): void {

    this.vaultService.listAllCategories().subscribe({
      next: (categories: any[]) => {
        this.dataSource.data = categories;
      },
      complete: () => {
        if (this.homeComponent) {
          this.currentView = "home"
        } else {
          this.currentView = "category-list"
        }
      },
      error: (err: any) => {
        console.error('Error al cargar las categorías:', err);
        alert('Ocurrió un error al cargar las categorías. Por favor, intenta nuevamente.');
      }
    });
  }


  onSelectionChange(categoryId: MatSelectionListChange): void {
    // Actualiza el estado seleccionado/desmarcado de la categoría específica
    this.dataSource.data = this.dataSource.data.map(category => ({
      ...category,
      selected: category.id === categoryId ? !category.selected : category.selected
    }));

    // Emite los IDs seleccionados actuales
    const selectedIds = this.dataSource.data
      .filter(category => category.selected)
      .map(category => category.id);

    this.filterChange.emit(selectedIds);
  }




  get selectAllControl() {
    return this.form.get('selectAll') as FormControl;
  }


  toggleSelect(id: string) {
    if (this.selectedCategories.has(id)) {
      this.selectedCategories.delete(id);
    } else {
      this.selectedCategories.add(id);
    }
  }

  filter(categoryIds: string[]): void {
    this.vaultService.findCategories(categoryIds,"").subscribe({
      next: (filteredCategories) => {
        this.dataSource.data = filteredCategories;
      },
      error: (err) => {
        console.error('Error filtering categories:', err);
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
            concatMap(id => this.vaultService.removeCategory(id))
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
    if (this.selectedCategories.size === 1) {
      const id = Array.from(this.selectedCategories)[0];
      // Aquí llama a la función para editar o navegar a `credential-detail` con `id`
      this.viewDetails(id);
    }
  }


  addCredential() {
    // Configura la ruta de origen
    this.navigationStateService.setFromRoute(this.currentView);

    // Navega al formulario para crear una nueva categorías
    this.router.navigate(['/category-detail'], {
      queryParams: { action: 'new' },
    });
  }


  viewDetails(id: string) {
    // Configura la ruta de origen
    this.navigationStateService.setFromRoute(this.currentView);
    console.log(this.currentView);

    // Navega al detalle de la categoria
    this.router.navigate(['/category-detail'], {
      queryParams: {action: 'edit', id: id},
    });

  }

  toggleSelectAll(event: any): void {
    const isChecked = event.checked;
    this.dataSource.data.forEach((row: any) => {
      row.selected = isChecked; // Marca o desmarca cada fila
      if (isChecked) {
        this.selectedCategories.add(row.id); // Agrega el ID al conjunto de seleccionados
      } else {
        this.selectedCategories.clear(); // Limpia el conjunto si se desmarca todo
      }
    });
  }

  toggleRowSelection(row: any): void {
    if (row.selected) {
      this.selectedCategories.add(row.id);
    } else {
      this.selectedCategories.delete(row.id);
    }
  }



}
