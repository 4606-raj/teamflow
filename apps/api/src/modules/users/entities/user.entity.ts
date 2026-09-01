import { InvitationStatus, Membership, MembershipRole, Prisma, SystemRole } from "@prisma/client";
import type {
    Invitation as SharedInvitation,
    Organization as SharedOrganization,
    User as SharedUser,
} from '@teamflow/types';

type UserWithMemberships = Prisma.UserGetPayload<{
    include: {
        memberships: {
            include: {
                organization: true;
            };
        };
        invitations: {
            include: {
                organization: true;
            };
        };
    };
}>;

type UserEntityInput = Omit<
    UserWithMemberships,
    "password" | "refreshTokenHash" | "memberships" | "invitations"
> & {
    memberships?: UserWithMemberships["memberships"];
    invitations?: UserWithMemberships["invitations"];
};

export class UserEntity implements SharedUser {
    id!: string;
    email!: string;
    firstName!: string | null;
    lastName!: string | null;
    systemRole!: SystemRole;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;

    organizations?: SharedOrganization[];
    invitations?: SharedInvitation[];

    constructor(user: UserEntityInput) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.systemRole = user.systemRole;
        this.isActive = user.isActive;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;

        this.organizations = user.memberships?.map((membership) => ({
            id: membership.organization.id,
            name: membership.organization.name,
            slug: membership.organization.slug,
            role: membership.role,
        }));

        this.invitations = user.invitations?.map((invitation) => ({
            id: invitation.id,
            token: invitation.token,
            email: invitation.email,
            role: invitation.role,
            status: invitation.status,
            organization: {
                id: invitation.organization.id,
                name: invitation.organization.name,
                slug: invitation.organization.slug,
            },
        }));
    }
}