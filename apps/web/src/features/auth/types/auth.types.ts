import type {
  Invitation,
  Organization,
  User,
  SystemRole,
  MembershipRole,
  InvitationStatus,
} from '@teamflow/types';

export type {
  Invitation,
  Organization,
  User,
  SystemRole,
  MembershipRole,
  InvitationStatus,
};

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string | null) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  fetchCurrentUser: () => Promise<User | undefined>;
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