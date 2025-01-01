import {Injectable} from '@angular/core';
import {VaultDto} from "../models/vault/vault-dto";
import {CategoryDto} from "../models/vault/category-dto";
import {CredentialDto} from "../models/vault/credential-dto";
import {ApiService} from "./api.service";
import {catchError, concatMap, map, Observable, of, switchMap, tap, throwError} from "rxjs";
import {VaultReadResponse} from "../models/api/vault-read-response";
import {ApiErrorResponse} from "../models/api/api-error-response";
import {deserialize, serialize} from 'class-transformer';
import {debugLog, extractGenericError} from "./shared.service";
import {decrypt, encrypt} from "./crypto.service";
import {VaultWriteRequest} from "../models/api/vault-write-request";
import sampleData from '../../test/sample1.json';
import {AuthService} from "./auth.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class VaultService {

  constructor(private apiService: ApiService,
              private authService: AuthService) {

    this.setDirty(false);
  }



  //---------------------------------------------------------------------------
  //Initialization and synchronize data to/from the backend
  //---------------------------------------------------------------------------

  public init(password: string): Observable<void> {
    this.setPassword(password);
    return this.read().pipe(
      map((vaultDto) => {
        // Si el VaultDto se obtiene correctamente, actualizamos el estado
        this.setVault(vaultDto);
        this.setDirty(false);
      }),
      catchError((error) => {
        this.reset();
        return throwError(() => extractGenericError(error)); // Propagamos el error para que pueda manejarse externamente
      })
    );
  }


  public sync(): Observable<void> {
    if (this.isDirty()) {
      return this.write().pipe(
          concatMap(() => this.read()), // Encadena read() después de un write exitoso
          tap((vaultDTO) => {
            if (vaultDTO) {
              this.setVault(vaultDTO); // Actualiza el estado interno con los datos del VaultDTO
              console.log('Vault sincronizado con éxito.');
            }
          }),
          map(() => {
            return;
          })
      );
    } else {
      return new Observable<void>((observer) => {
        // Emitimos un complete inmediato si no es necesario sincronizar
        observer.complete();
      });
    }
  }


  public changePassword(password: string): Observable<void> {
    this.setPassword(password);
    this.setDirty(true);
    return this.sync();
  }


  //---------------------------------------------------------------------------
  //CRUD functions
  //---------------------------------------------------------------------------

  public findCredentials(categoryIds:string[], filterText: string): Observable<CredentialDto[]>{
    return new Observable<CredentialDto[]>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault || !vault.credentials) {
        observer.next([]); // Si no hay datos, retorna una lista vacía
        observer.complete();
        return;
      }

      // Filtra por categorías si se proporcionan
      let filteredCredentials = vault.credentials;
      if (categoryIds && categoryIds.length > 0) {
        filteredCredentials = filteredCredentials.filter(credential =>
          categoryIds.every(categoryId => credential.categories.includes(categoryId))
        );
      }

      // Filtra por texto si se proporciona
      if (filterText) {
        filteredCredentials = filteredCredentials.filter(credential =>
          this.isContained(filterText, credential.serviceName) ||
          this.isContained(filterText, credential.username) ||
          this.isContained(filterText, credential.serviceUrl)
        );
      }

      // Retorna las credenciales filtradas
      observer.next(filteredCredentials);
      observer.complete();
    });
  }


  public findCategories(credentialIds:string[], filterText: string): Observable<CategoryDto[]>{
    return new Observable<CategoryDto[]>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault || !vault.categories) {
        observer.next([]); // Si no hay datos, retorna una lista vacía
        observer.complete();
        return;
      }

      // Filtra las categorías por credenciales si se proporcionan credentialIds
      let filteredCategories = vault.categories;
      if (credentialIds && credentialIds.length > 0) {
        const associatedCategoryIds = vault.credentials
          .filter(credential => credentialIds.includes(credential.id)) // Encuentra credenciales con los IDs dados
          .flatMap(credential => credential.categories); // Obtén las categorías asociadas

        // Filtra las categorías que están asociadas a las credenciales seleccionadas
        filteredCategories = filteredCategories.filter(category =>
          associatedCategoryIds.includes(category.id)
        );
      }

      // Filtra por texto si se proporciona
      if (filterText) {
        filteredCategories = filteredCategories.filter(category =>
          this.isContained(filterText, category.name)
        );
      }

      // Retorna las categorías filtradas
      observer.next(filteredCategories);
      observer.complete();
    });
  }


  public getCredential(id: string): Observable<CredentialDto>{
    return new Observable<CredentialDto>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault || !vault.credentials) {
        observer.error('Vault no encontrado o sin credenciales.');
        observer.complete();
        return;
      }

      // Encuentra la credencial con el ID dado
      const credential = vault.credentials.find(cred => cred.id === id);

      if (credential) {
        observer.next(credential); // Retorna la credencial encontrada
      } else {
        observer.error(`Credencial con id ${id} no encontrada.`);
      }

      observer.complete();
    });
  }


  public getCategory(id: string): Observable<CategoryDto>{
    return new Observable<CategoryDto>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault || !vault.categories) {
        observer.error('Vault no encontrado o sin categorías.');
        observer.complete();
        return;
      }

      // Encuentra la categoría con el ID dado
      const category = vault.categories.find(cat => cat.id === id);

      if (category) {
        observer.next(category); // Retorna la categoría encontrada
      } else {
        observer.error(`Categoría con id ${id} no encontrada.`);
      }

      observer.complete();
    });
  }

  public listAllCategories(): Observable<CategoryDto[]> {
    const vault = this.getVault();
    return of(vault ? vault.categories : []);
  }

  public listAllCredentials(): Observable<CredentialDto[]> {
    const vault = this.getVault();
    return of(vault ? vault.credentials : []);
  }


  public addCredential(newCredential: CredentialDto): Observable<void> {
    return new Observable<void>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault) {
        observer.error('Vault no encontrado.');
        observer.complete();
        return;
      }

      // Verificar que las categorías asociadas existen
      const invalidCategories = newCredential.categories.filter(
        categoryId => !vault.categories.some(category => category.id === categoryId)
      );
      if (invalidCategories.length > 0) {
        observer.error(`Categorías no válidas: ${invalidCategories.join(', ')}`);
        observer.complete();
        return;
      }

      // Añadir la nueva credencial al vault
      vault.credentials.push(newCredential);

      // Actualizar cada categoría con la nueva credencial
      newCredential.categories.forEach(categoryId => {
        const category = vault.categories.find(cat => cat.id === categoryId);
        if (category) {
          if (!category.credentials.includes(newCredential.id)) {
            category.credentials.push(newCredential.id);
          }
        }
      });

      // Guardar el vault actualizado y marcar como dirty
      this.setVault(vault);
      this.setDirty(true);

      observer.next();
      observer.complete();
    });
  }


  public addCategory(newCategory: CategoryDto): Observable<void> {
    return new Observable<void>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault) {
        observer.error('Vault no encontrado.');
        observer.complete();
        return;
      }

      // Verificar que las credenciales asociadas existen
      const invalidCredentials = newCategory.credentials.filter(
        credentialId => !vault.credentials.some(cred => cred.id === credentialId)
      );
      if (invalidCredentials.length > 0) {
        observer.error(`Credenciales no válidas: ${invalidCredentials.join(', ')}`);
        observer.complete();
        return;
      }

      // Añadir la nueva categoría al vault
      vault.categories.push(newCategory);

      // Actualizar cada credencial con la nueva categoría
      newCategory.credentials.forEach(credentialId => {
        const credential = vault.credentials.find(cred => cred.id === credentialId);
        if (credential) {
          if (!credential.categories.includes(newCategory.id)) {
            credential.categories.push(newCategory.id);
          }
        }
      });

      // Guardar el vault actualizado y marcar como dirty
      this.setVault(vault);
      this.setDirty(true);

      observer.next();
      observer.complete();
    });
  }


  public removeCredential(credentialId: string): Observable<void> {
    return new Observable<void>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault) {
        observer.error('Vault no encontrado.');
        observer.complete();
        return;
      }

      // Encuentra la credencial por ID
      const credentialIndex = vault.credentials.findIndex(cred => cred.id === credentialId);
      if (credentialIndex === -1) {
        observer.error(`Credencial con id ${credentialId} no encontrada.`);
        observer.complete();
        return;
      }

      // Eliminar la credencial del vault
      const removedCredential = vault.credentials.splice(credentialIndex, 1)[0];

      // Actualizar las categorías asociadas para eliminar el ID de la credencial
      removedCredential.categories.forEach(categoryId => {
        const category = vault.categories.find(cat => cat.id === categoryId);
        if (category) {
          category.credentials = category.credentials.filter(id => id !== credentialId);
        }
      });

      // Guardar el vault actualizado y marcar como dirty
      this.setVault(vault);
      this.setDirty(true);

      observer.next();
      observer.complete();
    });
  }


  public removeCategory(categoryId: string): Observable<void> {
    return new Observable<void>((observer) => {
      // Obtén el vault desde sessionStorage
      const vault = this.getVault();
      if (!vault) {
        observer.error('Vault no encontrado.');
        observer.complete();
        return;
      }

      // Encuentra la categoría por ID
      const categoryIndex = vault.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex === -1) {
        observer.error(`Categoría con id ${categoryId} no encontrada.`);
        observer.complete();
        return;
      }

      // Eliminar la categoría del vault
      const removedCategory = vault.categories.splice(categoryIndex, 1)[0];

      // Actualizar las credenciales asociadas para eliminar el ID de la categoría
      removedCategory.credentials.forEach(credentialId => {
        const credential = vault.credentials.find(cred => cred.id === credentialId);
        if (credential) {
          credential.categories = credential.categories.filter(id => id !== categoryId);
        }
      });

      // Guardar el vault actualizado y marcar como dirty
      this.setVault(vault);
      this.setDirty(true);

      observer.next();
      observer.complete();
    });
  }



  public updateCredential(credentialData: any): Observable<void> {
    if (!credentialData.id) {
    throw new Error('El ID de la credencial es obligatorio para actualizarla.');
  }

  // Paso 1: Eliminar la credencial existente
  return this.removeCredential(credentialData.id).pipe(
    switchMap(() =>
      // Paso 2: Añadir la nueva credencial (actualizada)
      this.addCredential(credentialData)
    ),
    catchError((error) => {
      console.error('Error al actualizar la credencial:', error);
      throw error; // Propaga el error para que pueda ser manejado externamente
    })
  );
  }

  public updateCategory(categoryData: any): Observable<void> {
    if (!categoryData.id) {
      throw new Error('El ID de la categoría es obligatorio para actualizarla.');
    }

    // Paso 1: Eliminar la categoría existente
    return this.removeCategory(categoryData.id).pipe(
        switchMap(() =>
            // Paso 2: Añadir la nueva categoría (actualizada)
            this.addCategory(categoryData)
        ),
        catchError((error) => {
          console.error('Error al actualizar la categoría:', error);
          throw error; // Propaga el error para que pueda ser manejado externamente
        })
    );
  }



  //---------------------------------------------------------------------------
  //Auxiliar functions
  //---------------------------------------------------------------------------

  public read(): Observable<VaultDto | undefined> {
    return this.authService.ensureAuthentication().pipe(
      switchMap(() => {
        return this.apiService.getVaultRead().pipe(
          map((response) => {
            const rawVaultContent: string = (response as VaultReadResponse).vaultContent;
            let vault: VaultDto | undefined;
            if (rawVaultContent && rawVaultContent !== "") {
              const jsonContentVault = decrypt(rawVaultContent, this.getPassword());
              vault = deserialize(VaultDto, jsonContentVault);
            }
            this.setLastRead((response as VaultReadResponse).lastUpdateTimestamp);
            return vault;
          })
        );
      }),
      catchError((error) => {
        return throwError(() => extractGenericError(error));
      })
    );
  }

  public write(): Observable<void> {
    return this.authService.ensureAuthentication().pipe(
      switchMap(() => {
        const vaultObject: VaultDto | null = this.getVault();
        if (!vaultObject) {
          return throwError(() => new Error("Vault no encontrado en la sesión."));
        }
        let vaultContent: string = serialize(vaultObject);
        vaultContent = encrypt(vaultContent, this.getPassword());
        const request: VaultWriteRequest = new VaultWriteRequest(vaultContent, this.getLastRead());
        return this.apiService.putVaultWrite(request).pipe(
          map(() => undefined) // Completa la operación sin emitir un valor
        );
      }),
      catchError((error) => {
        return throwError(() => extractGenericError(error));
      })
    );
  }


  //---------------------------------------------------------------------------
  //Auxiliar functions
  //---------------------------------------------------------------------------


  private setDirty(b: boolean){
    sessionStorage.setItem('vaultService__dirty', b.toString());
  }

  private isDirty(): boolean{
    const value = sessionStorage.getItem('vaultService__dirty');
    return value === 'true';
  }

  private setVault(vault?: VaultDto): void{
    if(vault && vault.name){
      sessionStorage.setItem('vaultService__vault', serialize(vault));
    }else{
      //For test purposes
      const newVault:VaultDto = Object.assign(new VaultDto("default vault"), sampleData);
      //const newVault:VaultDto = new VaultDto("default");
      sessionStorage.setItem('vaultService__vault', serialize(newVault));
    }
  }

  private getVault(): VaultDto|null {
    const vaultString = sessionStorage.getItem('vaultService__vault');
    return vaultString ? deserialize(VaultDto, vaultString) : null;
  }

  private setPassword(password: string){
    sessionStorage.setItem('vaultService__password', password);
  }

  private getPassword(): string{
    return sessionStorage.getItem('vaultService__password')||"";
  }

  private normalizeString(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }


  private isContained(from: string, to:string ): boolean {
    const cleanedFrom = this.normalizeString(from);
    const cleanedTo = this.normalizeString(to);
    return cleanedTo.includes(cleanedFrom);
  }


  private setLastRead(timestamp: string): void{
    sessionStorage.setItem('vaultService__lastUpdateTimestamp', timestamp);
  }

  private getLastRead(): string {
    return sessionStorage.getItem('vaultService__lastUpdateTimestamp')||"";
  }

  private reset(): void{
    sessionStorage.removeItem('vaultService__dirty');
    sessionStorage.removeItem('vaultService__vault');
    sessionStorage.removeItem('vaultService__lastUpdateTimestamp');
    sessionStorage.removeItem('vaultService__password');
  }

}
