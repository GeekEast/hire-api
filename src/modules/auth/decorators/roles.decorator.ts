import { RoleEnum } from '../enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Role = (role: RoleEnum) => SetMetadata(ROLES_KEY, role);
