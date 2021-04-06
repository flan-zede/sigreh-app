import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html'
})
export class SearchbarComponent {

  @Output() query = new EventEmitter<string>();
  @Output() return = new EventEmitter();

  search(text: string): void {
    const formatedText = text.toLowerCase().trim();
    if (formatedText.length > 2) { this.query.emit(formatedText); }
  }

}
