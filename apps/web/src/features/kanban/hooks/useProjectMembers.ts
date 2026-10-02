import { useGetOneProject } from '@/features/projects/hooks/use-project';

/** Assignee/reporter choices: only people who are members of the project. */
export function useProjectMembers(projectId: string | undefined) {
  const { data, isLoading } = useGetOneProject(projectId);

  const options = (data?.data.members ?? []).map((member) => ({
    value: member.id,
    label: [member.firstName, member.lastName].filter(Boolean).join(' ') || 'Unnamed member',
  }));

  return { options, isLoading };
}
