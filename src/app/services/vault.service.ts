import { Injectable } from '@angular/core';
import { VaultDto } from "../models/vault-dto";
import { CategoryDto } from "../models/category-dto";
import { CredentialDto } from "../models/credential-dto";
import { ApiService } from "./api.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { VaultReadResponse } from "../models/api/vault-read-response";
import { ApiErrorResponse } from "../models/api/api-error-response";
import {plainToClass, plainToInstance} from 'class-transformer';
import {debugLog} from "./shared.service";

@Injectable({
    providedIn: 'root'
})
export class VaultService {
    constructor(private apiService: ApiService) { }

    public read(): Observable<void> {
        return this.apiService.getVaultRead().pipe(
            map((response) => {
                const vaultBase64: string = (response as VaultReadResponse).vaultContent;
                let vault: VaultDto;

                if (!vaultBase64 || vaultBase64 === "") {
                    vault = this.createEmptyVault();
                } else {
                    const vaultString: string = atob(vaultBase64);
                    vault = plainToInstance(VaultDto, JSON.parse(vaultString))[0];
                }

                this.setVaultToSession(vault);
            }),
            catchError((error: ApiErrorResponse) => {
                sessionStorage.removeItem('vault');
                return throwError(() => error);
            })
        );
    }
    public write(): Observable<void> {
        const vault = this.getVaultFromSession();
        if (!vault) {
            return throwError(() => new Error('vault not found'));
        }
        const vaultString: any = JSON.stringify(vault.toJSON());
        const vaultBase64: string = btoa(vaultString);

        return this.apiService.putVaultWrite(vaultBase64).pipe(
            map(() => undefined),
            catchError((error: ApiErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    listAllCategories(): CategoryDto[] {
        const vault = this.getVaultFromSession();
        return vault ? vault.categories : [];
    }

    listAllCredentials(): CredentialDto[] {
        const vault = this.getVaultFromSession();
        return vault ? vault.credentials : [];
    }

    listCategoriesByCredential(credentialId: string): CategoryDto[] {
        const vault = this.getVaultFromSession();
        const credential = vault?.credentials.find(c => c.id === credentialId);
        return credential ? credential.categories : [];
    }

    listCredentialsByCategory(categoryId: string): CredentialDto[] {
        const vault = this.getVaultFromSession();
        const category = vault?.categories.find(c => c.id === categoryId);
        return category ? category.credentials : [];
    }

    getCategoryDetail(categoryId: string): CategoryDto | undefined {
        const vault = this.getVaultFromSession();
        return vault?.categories.find(c => c.id === categoryId);
    }

    addCategoryDetail(category: CategoryDto): void {
        const vault = this.getVaultFromSession();
        if (vault) {
            vault.categories.push(category);
            this.setVaultToSession(vault);
        }
    }

    removeCategoryDetail(categoryId: string): void {
        const vault = this.getVaultFromSession();
        if (vault) {
            vault.credentials.forEach(cred => {
                cred.categories = cred.categories.filter(cat => cat.id !== categoryId);
            });
            vault.categories = vault.categories.filter(c => c.id !== categoryId);
            this.setVaultToSession(vault);
        }
    }

    saveCategoryDetail(updatedCategory: CategoryDto): void {
        const vault = this.getVaultFromSession();
        if (vault) {
            const index = vault.categories.findIndex(c => c.id === updatedCategory.id);
            if (index !== -1) {
                vault.categories[index] = updatedCategory;
                vault.credentials.forEach(cred => {
                    if (updatedCategory.credentials.some(c => c.id === cred.id)) {
                        if (!cred.categories.some(c => c.id === updatedCategory.id)) {
                            cred.categories.push(updatedCategory);
                        }
                    } else {
                        cred.categories = cred.categories.filter(c => c.id !== updatedCategory.id);
                    }
                });
                this.setVaultToSession(vault);
            }
        }
    }

    getCredentialDetail(credentialId: string): CredentialDto | undefined {
        const vault = this.getVaultFromSession();
        return vault?.credentials.find(c => c.id === credentialId);
    }

    addCredential(credential: CredentialDto): void {
        const vault = this.getVaultFromSession();
        if (vault) {
            vault.credentials.push(credential);
            this.setVaultToSession(vault);
        }
    }

    removeCredential(credentialId: string): void {
        const vault = this.getVaultFromSession();
        if (vault) {
            vault.categories.forEach(cat => {
                cat.credentials = cat.credentials.filter(cred => cred.id !== credentialId);
            });
            vault.credentials = vault.credentials.filter(c => c.id !== credentialId);
            this.setVaultToSession(vault);
        }
    }

    saveCredential(updatedCredential: CredentialDto): void {
        const vault = this.getVaultFromSession();
        if (vault) {
            const index = vault.credentials.findIndex(c => c.id === updatedCredential.id);
            if (index !== -1) {
                vault.credentials[index] = updatedCredential;
                vault.categories.forEach(cat => {
                    if (updatedCredential.categories.some(c => c.id === cat.id)) {
                        if (!cat.credentials.some(c => c.id === updatedCredential.id)) {
                            cat.credentials.push(updatedCredential);
                        }
                    } else {
                        cat.credentials = cat.credentials.filter(c => c.id !== updatedCredential.id);
                    }
                });
                this.setVaultToSession(vault);
            }
        }
    }

    private getVaultFromSession(): VaultDto | null {
        const vaultData = sessionStorage.getItem('vault');
        return vaultData ? plainToInstance(VaultDto, JSON.parse(vaultData))[0] : null;
    }

    private setVaultToSession(vault: VaultDto): void {
        if (!vault) {
            console.error("Intento de guardar un vault nulo o indefinido en sessionStorage.");
            return;
        }
        sessionStorage.setItem('vault', JSON.stringify(vault.toJSON()));
    }

    private createEmptyVault(): VaultDto {
        return new VaultDto("default vault", [], []);
    }
}
