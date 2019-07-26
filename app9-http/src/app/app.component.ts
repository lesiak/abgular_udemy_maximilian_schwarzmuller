import {Component, OnInit} from '@angular/core';
import {Post, PostData} from './post.model';
import {PostsService} from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  errorMessage: string = null;

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
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
      error => this.errorMessage = error.message
    );
  }
}
