import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth-token');

  console.log('[Interceptor] URL:', req.url, 'token?', !!token);

  if (!token || req.url.includes('/auth')) {
    return next(req);
  }

  const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  console.log('[Interceptor] Added Authorization header');

  return next(authReq);
};

