import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';

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
        if (count === 2) {
          observer.complete();
        }
        if (count > 3) {
          observer.error(new Error('count is greater than 3!'));
        }
      }, 1000);
    });

    this.firstObsSubscription = customIntervalObservable.subscribe(
      count => {
        console.log(count);
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('Completed!')
      });
  }

  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe();
  }

}
