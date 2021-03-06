import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SKIP_JWT_KEY } from 'modules/auth/decorators/skipJwt.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipJwt = this.reflector.getAllAndOverride<boolean>(SKIP_JWT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipJwt) return true;
    return super.canActivate(context);
  }
}
