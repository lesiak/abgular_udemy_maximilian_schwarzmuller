import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  @Output() serverCreated = new EventEmitter<{ serverName: string, serverContent: string }>();
  @Output() blueprintCreated = new EventEmitter<{ serverName: string, serverContent: string }>();
  newServerContent = '';

  constructor() {
  }

  ngOnInit() {
  }

  onAddServer(newServerName: string) {
    this.serverCreated.emit({serverName: newServerName, serverContent: this.newServerContent});
  }

  onAddBlueprint(newServerName: string) {
    this.blueprintCreated.emit({serverName: newServerName, serverContent: this.newServerContent});
  }

}
