export class CounterService {
  activityChangesCount = 0;

  incrementActivityChangesCount() {
    this.activityChangesCount++;
  }
}
