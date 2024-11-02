import { Injectable } from '@angular/core';
import { CredentialDto } from '../src/app/models/credential-dto';
import { CategoryDto } from '../src/app/models/category-dto';
import { RelCredentialCategoryDto  } from '../src/app/models/rel-credential-category-dto';
import {VaultDto} from "../src/app/models/vault-dto";

@Injectable({
  providedIn: 'root'
})
export class VaultService {



  constructor() {

  }

  write(): void {
    //Crear estructura de ejemplo programaticalmente.
    //Devolver estructura
  }

  read(): VaultDto{

  }

  listCredentials(){

  }

  listCategories(){

  }

}
