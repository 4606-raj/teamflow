import { Membership, Prisma, SystemRole } from "@prisma/client";

type UserWithMemberships = Prisma.UserGetPayload<{
    include: {
        memberships: {
            include: {
                organization: true;
            };
        };
    };
}>;

type UserEntityInput = Omit<
    UserWithMemberships,
    "password" | "refreshTokenHash" | "memberships"
> & {
    memberships?: UserWithMemberships["memberships"];
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
    }
}