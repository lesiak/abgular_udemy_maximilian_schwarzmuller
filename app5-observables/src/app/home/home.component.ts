import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private firstObsSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe(count => {
    //   console.log(count);
    // });
    const customIntervalObservable = new Observable<number>(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count++);
        if (count === 10) {
          observer.complete();
        }
        if (count > 11) {
          observer.error(new Error('count is greater than 11!'));
        }
      }, 1000);
    });

    const mappedObservable: Observable<string> = customIntervalObservable.pipe(
      filter(data => data % 2 === 0),
      map(data => `Round ${data + 1}`));

    this.firstObsSubscription = mappedObservable.subscribe(
      count => {
        console.log(count);
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('Completed!');
      });
  }

  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe();
  }

}
