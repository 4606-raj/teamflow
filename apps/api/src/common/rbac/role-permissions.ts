import { Role, SystemRole } from '@/common/enums/role.enum';
import { Permission } from '@/common/enums/permission.enum';

export const ROLE_PERMISSIONS: Record<Role | SystemRole, Permission[]> = {
  [Role.OWNER]: [
    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
    Permission.MEMBER_UPDATE_ROLE,

    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
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

  [Role.MEMBER]: [Permission.ORGANIZATION_READ],

  [SystemRole.SUPERADMIN]: [
    Permission.ORGANIZATION_DELETE,
    Permission.ORGANIZATION_CREATE,
    Permission.ORGANIZATION_READ_ALL,

    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
    Permission.MEMBER_UPDATE_ROLE,

    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
  ],
};
