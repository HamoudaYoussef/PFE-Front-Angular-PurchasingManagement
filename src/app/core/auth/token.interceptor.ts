import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TokenStorageService} from "../../pages/Global/shared-service/token-storage.service";
import {ToastrService} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "../../pages/Global/shared-service/error-handlin.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor( private TokenStorageService: TokenStorageService,
               private toastr: ToastrService,
               private cookieService: CookieService,
               private router: Router,
               private errorHandlingService: ErrorHandlingService)
  {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      setHeaders: {
        Authorization: `${this.TokenStorageService.getToken()}`,
        Application: require('package.json').name,
      }
    });

    return next.handle(request).pipe(
        catchError((error: any) => {
          if (error instanceof HttpErrorResponse && this.errorHandlingService.showError()) {
            if (error.status === 401 || error.status === 403){
              const message = 'Something went wrong!';
              localStorage.clear();
              this.cookieService.deleteAll('/', window.location.hostname.substring(window.location.hostname.indexOf('.')));
              this.router.navigate(['/login']);
              this.toastr.error(message, 'Unauthorized', {
                closeButton: true,
                positionClass: 'toast-top-right',
                progressBar: true,
                disableTimeOut: false,
              });
            }
            else{
            const message = 'Something went wrong!';
            this.toastr.error(message, '', {
              closeButton: true,
              positionClass: 'toast-top-right',
              progressBar: true,
              disableTimeOut: false,
            });
          }

          }
          // Halt the request pipeline by returning an observable that emits an error
          return throwError(error);
        })
    );
  }
}