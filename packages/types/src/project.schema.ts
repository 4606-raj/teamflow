import { z } from 'zod';

export const projectStatusValues = [
  'ACTIVE',
  'INACTIVE',
  'PLANNING',
  'INPROGRESS',
  'COMPLETE',
  'CANCELED',
] as const;

export const projectMemberRoleValues = [
  'Guest',
  'Client',
  'Developer',
  'Maintainer',
  'Admin',
] as const;

export type ProjectStatus = (typeof projectStatusValues)[number];
export type ProjectMemberRole = (typeof projectMemberRoleValues)[number];

export const projectMemberSchema = z.object({
  id: z.string().cuid('Please provide a valid member id'),
  role: z.enum(projectMemberRoleValues, {
    message: 'Please provide a valid role for the project member',
  }),
});

export const projectCreateSchema = z.object({
  name: z.string().trim().min(3, 'Please provide a valid name for the project'),
  description: z
    .string()
    .trim()
    .max(2000, 'Project description is too long')
    .optional(),
  status: z.enum(projectStatusValues, {
    message: 'Please provide a valid status for the project',
  }),
  color: z.string().regex(/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/, {
    message: 'Invalid HEX color format. Must be a valid 3 or 6 digit hex code.',
  }),
  tags: z.array(z.string().cuid()).default([]),
  techStack: z.array(z.string().cuid()).default([]),
  members: z.array(projectMemberSchema).default([]),
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type CreateProjectRequest = z.infer<typeof projectCreateSchema>;
