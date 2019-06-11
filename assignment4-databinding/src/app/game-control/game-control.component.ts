import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css'],
  preserveWhitespaces: true
})
export class GameControlComponent implements OnInit {

  timerId: number = null;
  timerValue = 0;

  @Output() timerTicked = new EventEmitter<{ timerValue: number }>();

  constructor() { }

  ngOnInit() {
  }

  onGameStart() {
    if (this.timerId === null) {
      this.timerId = setInterval(() => this.emitTickEvent(), 1000);
    }
  }

  emitTickEvent() {
    this.timerTicked.emit({timerValue: this.timerValue++});
  }

  onGameStop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
