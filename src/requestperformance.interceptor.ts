import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class RequestPerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const label = `${context.getClass().name}.${context.getHandler().name}`;

    console.time(label);

    return next.handle().pipe(tap(() => console.timeEnd(label)));
  }
}
