import { z } from "zod";
import { ProjectStatus } from "@prisma/client";
import { ProjectMemberRole } from "@prisma/client";

export const ProjectCreateSchema = z.object({
 	name: z.string().min(3, 'Please provide a valid name for the project'),
 	description: z.string().optional(),
 	status: z.enum(ProjectStatus, 'Please provide a valid status for the project'),
 	color: z.string().regex(/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/, {
	    message: "Invalid HEX color format. Must be a valid 3 or 6 digit hex code."}),

 	tags: z.array(z.string().cuid()),
 	techStack: z.array(z.string().cuid()),
 	members: z.array(z.object({id: z.string().cuid(), role: z.nativeEnum(ProjectMemberRole)})),
});

export type projectCreateInput = z.infer<typeof ProjectCreateSchema>