import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post, PostData} from './post.model';
import {PostsService} from './posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  errorMessage: string = null;
  private errorSubscription: Subscription;

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.errorSubscription = this.postsService.error.subscribe(
      errorMessage => this.errorMessage = errorMessage
    );
    this.fetchPosts();
  }

  onCreatePost(postData: PostData) {
    this.postsService.savePost(postData);
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    this.postsService.deleteAllPosts().subscribe(
      () => this.loadedPosts = []
    );
  }

  private fetchPosts() {
    this.isFetching = true;
    this.errorMessage = null;
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      error => {
        this.errorMessage = error.message;
        this.isFetching = false;
      }
    );
  }

  onHandleError() {
    this.errorMessage = null;
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

}
