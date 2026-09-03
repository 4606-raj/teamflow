export enum Permission {
  ORGANIZATION_CREATE = 'organization:create',
  ORGANIZATION_READ = 'organization:read',
  ORGANIZATION_READ_ALL = 'organization:read-all',
  ORGANIZATION_UPDATE = 'organization:update',
  ORGANIZATION_DELETE = 'organization:delete',

  MEMBER_INVITE = 'member:invite',
  MEMBER_REMOVE = 'member:remove',
  MEMBER_UPDATE_ROLE = 'member:update-role',
}
