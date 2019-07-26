import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post, PostData} from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {

  constructor(private http: HttpClient) {
  }

  savePost(postData: PostData) {
    // Send Http request
    this.http
      .post<{ name: string }>('https://angular-udemy-93cb1.firebaseio.com/posts.json', postData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<{ [key: string]: PostData }>('https://angular-udemy-93cb1.firebaseio.com/posts.json')
      .pipe(map(responseData => Object.entries(responseData).map(e => ({id: e[0], ...e[1]}))));
  }
}
