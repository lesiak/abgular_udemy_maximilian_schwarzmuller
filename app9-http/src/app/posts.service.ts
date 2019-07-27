import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
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
      .post<{ name: string }>(this.POSTS_URL, postData, {observe: 'response'})
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<{ [key: string]: PostData }>(
      this.POSTS_URL,
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello'}),
        params: new HttpParams().set('print', 'pretty')
      })
      .pipe(
        map(PostsService.responseDataToPosts),
        catchError(errorResp => {
          // send to analytics
          return throwError(errorResp);
        })
      );
  }

  deleteAllPosts() {
    return this.http.delete(this.POSTS_URL, {observe: 'events'})
      .pipe(tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Sent) {
          console.log('Request sent');
        }
      }));
  }

}
