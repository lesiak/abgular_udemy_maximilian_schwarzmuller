import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('divState', [
      state('normal', style({
        backgroundColor: 'red',
        transform: 'translateX(0)'
      })),
      state('highlighted', style({
        backgroundColor: 'yellow',
        transform: 'translateX(100px)'
      })),
      transition('normal <=> highlighted', animate(300))
    ]),
    trigger('wildState', [
      state('normal', style({
        backgroundColor: 'red',
        transform: 'translateX(0) scale(1)',
        borderRadius: '0px'
      })),
      state('highlighted', style({
        backgroundColor: 'yellow',
        transform: 'translateX(100px) scale(1)',
        borderRadius: '0px'
      })),
      state('shrunk', style({
        backgroundColor: 'green',
        transform: 'translateX(0px) scale(0.5)',
        borderRadius: '0px'
      })),
      transition('normal => highlighted', animate(300)),
      transition('highlighted => normal', animate(800)),
      transition('shrunk <=> *', [
        style({
          backgroundColor: 'orange',
        }),
        animate('1s', style({
          borderRadius: '50px'
        })),
        animate(500)
      ])
    ]),
    trigger('list1', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
          style({
            opacity: 0,
            transform: 'translateX(-100px)'
          }),
          animate(300)
        ]
      ),
      transition('* => void', [
          animate(300, style({
            opacity: 0,
            transform: 'translateX(100px)'
          }))
        ]
      )
    ]),
  ]
})
export class AppComponent {
  state = 'normal';
  wildState = 'normal';
  list = ['Milk', 'Sugar', 'Bread'];

  onAdd(item) {
    this.list.push(item);
  }

  onDelete(item) {
    this.list.splice(this.list.indexOf(item), 1);
  }

  onAnimate() {
    const newState = this.state === 'normal' ? 'highlighted' : 'normal';
    this.state = newState;
    this.wildState = newState;
  }

  onShrink() {
    this.wildState = 'shrunk';
  }
}
