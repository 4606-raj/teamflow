import { Prisma } from '@prisma/client';

export const projectResponseSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  color: true,
  createdAt: true,

  techStack: {
    select: {
      technology: {
        select: {
          id: true,
          name: true,
          MetaData: true,
        },
      },
    },
  },

  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  members: {
    select: {
      role: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  },
} satisfies Prisma.ProjectSelect;

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  select: typeof projectResponseSelect;
}>;