import {Component, OnInit} from '@angular/core';

import {ServersService} from '../servers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CanComponentDeactivate} from './can-deactivate-guard.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number, name: string, status: string };
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  changesSaved = false;

  constructor(private serversService: ServersService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // console.log(this.route.snapshot.queryParams);
    // We can safely rely on subscribe as the callback does not rely on a state set up in the ngOnInit synchronously
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        console.log(queryParams);
        this.allowEdit = parseInt(queryParams['allowEdit'], 10) === 1;
      }
    );
    this.route.params.subscribe(
      (params: Params) => {
        const id = parseInt(params['id'], 10);
        this.server = this.serversService.getServer(id);
        this.serverName = this.server.name;
        this.serverStatus = this.server.status;
      }
    );
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    } else {
      if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status) && !this.changesSaved) {
        return confirm('Do you want to discard the changes?');
      } else {
        return true;
      }
    }
  }

}
