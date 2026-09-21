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
    .min(1, 'Please provide a project description')
    .max(2000, 'Project description is too long'),
  status: z.enum(projectStatusValues, {
    message: 'Please provide a valid status for the project',
  }),
  color: z.string().regex(/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/, {
    message: 'Invalid HEX color format. Must be a valid 3 or 6 digit hex code.',
  }),
  tags: z.array(z.string().cuid()).min(1, 'Please select at least one tag'),
  techStack: z.array(z.string().cuid()).min(1, 'Please select at least one technology'),
  members: z.array(projectMemberSchema).default([]),
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type CreateProjectRequest = z.infer<typeof projectCreateSchema>;

export interface ProjectTechnology {
  id: string;
  name: string;
  metaData: unknown;
}

export interface ProjectTag {
  id: string;
  name: string;
}

export interface ProjectMemberResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: ProjectMemberRole;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  color: string | null;
  createdAt: string;
  techStack: ProjectTechnology[];
  tags: ProjectTag[];
  members: ProjectMemberResponse[];
}
