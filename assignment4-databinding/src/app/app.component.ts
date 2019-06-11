import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  timerTicks: number[]  = [];

  onTimerTicked(event: {timerValue: number}) {
    this.timerTicks.push(event.timerValue);
  }
}
