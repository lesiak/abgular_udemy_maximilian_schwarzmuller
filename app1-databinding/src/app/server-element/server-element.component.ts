import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
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
  AfterViewInit,
  DoCheck,
  OnDestroy {

  @Input() name: string;
  @ViewChild('heading', {static: true}) heading: ElementRef;

  constructor() {
    console.log('constructor called');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    console.log('Text content: ' + this.heading.nativeElement.textContent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges called');
    console.log(changes);
  }

  ngDoCheck(): void {
    console.log('ngDoCheck called');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    console.log('Text content: ' + this.heading.nativeElement.textContent);

  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
  }



}
