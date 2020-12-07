import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // set status code
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message ?? exception.message.error;
    if (exception.status) status = exception.status;
    if (exception.name === 'CastError') status = HttpStatus.BAD_REQUEST;

    process.env.NODE_ENV !== 'production' && console.log(exception);

    response.status(status).json({
      status,
      error:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'We are fixing this techinical issue.'
          : message,
    });
  }
}
