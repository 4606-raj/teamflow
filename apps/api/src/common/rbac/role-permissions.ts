import { Role } from '@/common/enums/role.enum';
import { Permission } from '@/common/enums/permission.enum';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.OWNER]: [
    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
    Permission.ORGANIZATION_DELETE,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
    Permission.MEMBER_UPDATE_ROLE,
  ],

  [Role.ADMIN]: [
    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
  ],

  [Role.MEMBER]: [
    Permission.ORGANIZATION_READ,
  ],
};