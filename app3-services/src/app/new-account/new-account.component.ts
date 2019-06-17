import {Component} from '@angular/core';
import {LoggingService} from '../shared/logging.service';
import {AccountsService} from '../shared/accounts.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent {

  constructor(private accountsService: AccountsService,
              private loggingService: LoggingService) {
    this.accountsService.statusUpdated.subscribe(
      (status: string) => console.log(`Received status update from another component: ${status}`)
    );
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName, accountStatus);
  }

}
