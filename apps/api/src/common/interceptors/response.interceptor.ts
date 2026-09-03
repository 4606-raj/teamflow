import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (request.method === 'OPTIONS') {
      return next.handle();
    }

    return next.handle().pipe(
      map((response) => {
        // Custom response format
        if (
          response &&
          typeof response === 'object' &&
          'message' in response &&
          'data' in response
        ) {
          return {
            success: true,
            message: response.message,
            data: response.data,
          };
        }

        // Default response format
        return {
          success: true,
          message: 'Success',
          data: response,
        };
      }),
    );
  }
}
