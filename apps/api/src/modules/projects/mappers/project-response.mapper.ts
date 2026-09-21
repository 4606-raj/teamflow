import type { Project as ProjectResponseDto } from '@teamflow/types';
import { ProjectWithRelations } from '../types/projects.types';

export class ProjectMapper {
  static toResponse(
    project: ProjectWithRelations,
  ): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      color: project.color,
      createdAt: project.createdAt.toISOString(),

      techStack: project.techStack.map(({ technology }) => ({
        id: technology.id,
        name: technology.name,
        metaData: technology.MetaData
      })),

      tags: project.tags.map(({ tag }) => ({
        id: tag.id,
        name: tag.name,
      })),

      members: project.members.map(({ user, role }) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role,
      })),
    };
  }

  static toResponseList(
    projects: ProjectWithRelations[],
  ): ProjectResponseDto[] {
    return projects.map(ProjectMapper.toResponse);
  }
}