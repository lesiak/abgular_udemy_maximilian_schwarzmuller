import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numbers = [1, 2, 3, 4, 5];
  onlyOdd = false;

  filteredNumbers(): number[] {
    return this.onlyOdd ? this.numbers.filter((n) => n % 2 === 1) : this.numbers;
  }
}
