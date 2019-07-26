import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post, PostData} from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {

  private POSTS_URL = 'https://angular-udemy-93cb1.firebaseio.com/posts.json';

  error = new Subject<string>();

  static responseDataToPosts(responseData: { [key: string]: PostData }): Post[] {
    if (!responseData) {
      return [];
    }
    return Object.entries(responseData).map(PostsService.entryToPost);
  }

  static entryToPost(entry: [string, PostData]): Post {
    return {id: entry[0], ...entry[1]};
  }

  constructor(private http: HttpClient) {
  }

  savePost(postData: PostData) {
    // Send Http request
    this.http
      .post<{ name: string }>(this.POSTS_URL, postData)
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<{ [key: string]: PostData }>(this.POSTS_URL)
      .pipe(map(PostsService.responseDataToPosts));
  }

  deleteAllPosts() {
    return this.http.delete(this.POSTS_URL);
  }

}
