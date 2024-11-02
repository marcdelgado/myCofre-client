import {Component, OnInit} from '@angular/core';
import {CredentialDto} from "../../models/credential-dto";
import {CategoryDto} from "../../models/category-dto";
import {VaultService} from "../../services/vault.service";

@Component({
  selector: 'app-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: ['./credential-list.component.scss']
})
export class CredentialListComponent implements OnInit{

  categories: CategoryDto[] = [];
  credentials: CredentialDto[] = [];

  constructor(private vaultService: VaultService) {}

  ngOnInit(): void {
    this.vaultService.read().subscribe(
        () => {
          this.categories = this.vaultService.listAllCategories();
          this.credentials = this.vaultService.listAllCredentials();
        },
        error => {
          console.error("Error al cargar el vault:", error);
        }
    );
  }

}
