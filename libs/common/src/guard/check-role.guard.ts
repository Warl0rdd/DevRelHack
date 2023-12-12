import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { UserPosition } from '../enum/user.position.enum';

export const CheckRoleGuard = (role: UserPosition) => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      // do something with context and role
      const request: Request = context.switchToHttp().getRequest();
      const userData = request.headers['user'];
      return userData.position === role;
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};
