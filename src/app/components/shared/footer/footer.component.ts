import {ChangeDetectorRef, Component, Optional, SkipSelf} from '@angular/core'
import {Fontawesome} from "../fontawesome";
import {VaultService} from "../../../services/vault.service";
import {HomeComponent} from "../../home/home.component";
import {FormBuilder} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {NavigationStateService} from "../../../services/navigation-state.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent{

}
