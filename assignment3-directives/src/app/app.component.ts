import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  detailsVisible = false;
  displayDetailsClickTimestamps = [];

  onDisplayDetailsClicked() {
    this.detailsVisible = !this.detailsVisible;
    const currentTime = Date.now();
    this.displayDetailsClickTimestamps.push(currentTime);
  }
}
