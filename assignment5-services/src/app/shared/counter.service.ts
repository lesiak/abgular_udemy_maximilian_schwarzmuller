import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CounterService {
  activityChangesCount = 0;

  incrementActivityChangesCount() {
    this.activityChangesCount++;
  }
}
