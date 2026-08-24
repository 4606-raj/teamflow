import { InvitationStatus, Membership, MembershipRole, Prisma, SystemRole } from "@prisma/client";

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

export class UserEntity {
    id!: string;
    email!: string;
    firstName!: string | null;
    lastName!: string | null;
    systemRole!: SystemRole;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;

    organizations?: {
        id: string;
        name: string;
        slug: string;
        role: Membership["role"];
    }[];

    invitations?: {
        id: string;
        token: string | null;
        email: string;
        role: MembershipRole;
        status: InvitationStatus;
        organization: Object;
    }[];

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
            organization: invitation.organization,
        }));
    }
}