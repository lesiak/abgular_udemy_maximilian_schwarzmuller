import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('In request interceptor');
    const modifiedRequest = req.clone({headers: req.headers.append('Custom-Auth', 'xyz')});
    return next.handle(modifiedRequest);
  }
}
