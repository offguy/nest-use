import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ModefyDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          // If the data is an array, remove _id from each item
          return data.map(({ _id, ...user }) => user);
        } else if (data && typeof data === 'object') {
          // If the data is a single object, remove _id from it
          const { _id, ...user } = data;
          return user;
        }
        return data; // In case data is not an object or array, return it as is
      }),
    );
  }
}
