import { z } from 'zod';
import { ProjectMemberRole, ProjectStatus } from '@prisma/client';
import { projectCreateSchema } from '@teamflow/types';

const prismaProjectStatusValues = Object.values(ProjectStatus) as [
  ProjectStatus,
  ...ProjectStatus[],
];

const prismaProjectMemberRoleValues = Object.values(ProjectMemberRole) as [
  ProjectMemberRole,
  ...ProjectMemberRole[],
];

export const ProjectCreateSchema = projectCreateSchema.extend({
  status: z.enum(prismaProjectStatusValues, {
    message: 'Please provide a valid status for the project',
  }),
  members: z
    .array(
      z.object({
        id: z.string().cuid('Please provide a valid member id'),
        role: z.enum(prismaProjectMemberRoleValues, {
          message: 'Please provide a valid role for the project member',
        }),
      }),
    )
    .default([]),
});

export type projectCreateInput = z.infer<typeof ProjectCreateSchema>;