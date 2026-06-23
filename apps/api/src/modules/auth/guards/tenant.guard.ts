import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        if(!req.user.organizationId) {
            throw new ForbiddenException("Organization context required");
        }

        return true;
    }
}