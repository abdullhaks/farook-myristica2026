import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as any;
        message = resObj.message || exception.message;
        errors = resObj.errors || null;
      } else {
        message = exceptionResponse || exception.message;
      }
    } else if (exception && exception.name === 'ValidationError') {
      // Handle Mongoose Validation Error (if any fallback)
      status = HttpStatus.BAD_REQUEST;
      message = 'Database validation failed';
      errors = Object.keys(exception.errors).map(key => exception.errors[key].message);
    } else if (exception && exception.code === 11000) {
      // Handle Mongoose Duplicate Key Error
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry detected';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error
    console.error(`[ExceptionFilter] Error at ${request.method} ${request.url}:`, exception);

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
