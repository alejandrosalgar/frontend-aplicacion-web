import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message?: string;
}

function isApiSuccessEnvelope<T>(body: unknown): body is ApiSuccessEnvelope<T> {
  if (!body || typeof body !== 'object') {
    return false;
  }
  const value = body as Record<string, unknown>;
  return value['success'] === true && 'data' in value;
}

export const apiResponseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    map((event) => {
      if (!(event instanceof HttpResponse)) {
        return event;
      }
      if (!isApiSuccessEnvelope(event.body)) {
        return event;
      }
      return event.clone({ body: event.body.data });
    }),
  );
};
