export type SystemRole = 'SUPERADMIN' | 'USER';
export type MembershipRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: MembershipRole;
}

export interface Invitation {
  id: string;
  token: string | null;
  email: string;
  role: MembershipRole;
  status: InvitationStatus;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  systemRole: SystemRole;
  organizations?: Organization[];
  invitations?: Invitation[];
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateOrganizationRequest {
  name: string;
}
