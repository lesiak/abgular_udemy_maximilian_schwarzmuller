import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  @Output() serverCreated = new EventEmitter<{ serverName: string, serverContent: string }>();
  @Output() blueprintCreated = new EventEmitter<{ serverName: string, serverContent: string }>();
  // Angular8: resolve query results before change detection runs
  @ViewChild('serverContentInput', {static: false}) serverContentInput: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  onAddServer(newServerName: string) {
    this.serverCreated.emit({serverName: newServerName, serverContent: this.serverContentInput.nativeElement.value});
  }

  onAddBlueprint(newServerName: string) {
    this.blueprintCreated.emit({serverName: newServerName, serverContent: this.serverContentInput.nativeElement.value});
  }

}
