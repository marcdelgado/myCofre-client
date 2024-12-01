import {Component, EventEmitter, Output} from '@angular/core';


@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrl: './browser.component.scss'
})
export class BrowserComponent {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(event: Event): void {
    event.preventDefault();
    this.search.emit(this.searchTerm.trim());
  }
}
