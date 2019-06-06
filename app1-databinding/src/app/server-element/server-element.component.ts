import {
  Component,
  DoCheck,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.Emulated // default
})
export class ServerElementComponent implements
    OnInit,
    OnChanges,
    DoCheck,
    OnDestroy {

  @Input() name: string;

  constructor() {
    console.log('constructor called');
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges called');
    console.log(changes)
  }

  ngDoCheck(): void {
    console.log('ngDoCheck called');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
  }



}
