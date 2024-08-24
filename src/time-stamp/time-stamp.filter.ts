import { Request, Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class TimeStampFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status : number = exception.getStatus()

    response
    .status(status)
    .json({statusCode: status,
      path: request.url,
      timestamp : new Date().toLocaleString(),
      message: exception.message
    })
  }
  
}
