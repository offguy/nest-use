import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Body } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    console.log(context.switchToHttp().getRequest().method)


    return next.handle().pipe(tap(() => console.log("returning....")));
  }
}
