import {Component, Input} from '@angular/core';
import {LoggingService} from '../shared/logging.service';
import {AccountsService} from '../shared/accounts.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  preserveWhitespaces: true
})
export class AccountComponent {
  @Input() account: { name: string, status: string };
  @Input() id: number;

  constructor(private accountsService: AccountsService,
              private loggingService: LoggingService) {
  }

  onSetTo(status: string) {
    this.accountsService.updateStatus(this.id, status);
    this.accountsService.statusUpdated.emit(status);
  }
}
