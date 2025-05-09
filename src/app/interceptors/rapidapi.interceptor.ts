import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const rapidApiInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': environment.contentType,
      'x-rapidapi-host': 'crud-operations2.p.rapidapi.com',
      'x-rapidapi-key': environment.key,
    },
  });

  return next(modifiedReq);
};