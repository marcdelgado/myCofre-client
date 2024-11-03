import { Injectable } from '@angular/core';
import { VaultDto } from "../models/vault-dto";
import { CategoryDto } from "../models/category-dto";
import { CredentialDto } from "../models/credential-dto";
import { ApiService } from "./api.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { VaultReadResponse } from "../models/api/vault-read-response";
import { ApiErrorResponse } from "../models/api/api-error-response";
import {deserialize, plainToClass, plainToInstance, serialize} from 'class-transformer';
import {debugLog} from "./shared.service";
import {AuthLoginRequest} from "../models/api/auth-login-request";
import {decrypt, encrypt, setRepassword} from "./crypto.service";
import {VaultWriteRequest} from "../models/api/vault-write-request";

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
                sessionStorage.setItem("lastUpdateTimestamp", (response as VaultReadResponse).lastUpdateTimestamp);
                if (!vaultBase64 || vaultBase64 === "") {
                    vault = this.createEmptyVault();
                } else {
                    let vaultString: string = atob(vaultBase64);
                    //Provisional para test:
                    let request: AuthLoginRequest;
                    const password = sessionStorage.getItem("password");
                    debugLog(vaultString);
                    if(password) vaultString = decrypt(vaultString, password);



                    vault = deserialize(VaultDto, vaultString);
                    //vault = instanceToClass(VaultDto, vaultString);
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
        const vault:any = this.getVaultFromSession();
        let vaultString:string= serialize(vault);




        const password = sessionStorage.getItem("password");
        debugLog(password);
        if(password) vaultString = encrypt(vaultString, password);


        const vaultBase64: string = btoa(vaultString);

        const lastUpdateTimestamp:string = sessionStorage.getItem("lastUpdateTimestamp") || "";
        debugLog(lastUpdateTimestamp);
        const request:VaultWriteRequest = new VaultWriteRequest(vaultBase64, lastUpdateTimestamp);

        return this.apiService.putVaultWrite(request).pipe(
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
        return vaultData ? deserialize(VaultDto, vaultData) : null;
    }

    private setVaultToSession(vault: VaultDto): void {
        sessionStorage.setItem('vault', serialize(vault));
    }

    private createEmptyVault(): VaultDto {
        return new VaultDto("default vault", [], []);
    }
}
