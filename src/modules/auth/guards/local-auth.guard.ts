import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { pick, set } from 'lodash';
import { userInfo } from 'os';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = await this.authService.validateUser(req?.body);
    if (!user) return false;
    const user_info = pick(user, ['username']);
    set(user_info, 'user_id', String(user._id));
    set(req, 'user', userInfo);
    return true;
  }
}
