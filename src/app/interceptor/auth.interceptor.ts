import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return next(clonedReq).pipe(
    catchError((err) => {
      if ([401, 403].includes(err.status)) {
        router.navigate(['/home']);
      }
      return throwError(() => err);  
    }),
    delay(100), 
    finalize(() => {
    })
  );
};
