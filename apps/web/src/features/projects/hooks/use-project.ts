import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/projects.api';

export function useCreateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: projectApi.create,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['projects'],
			})
		}
	})
}

export function useUpdateProject(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Parameters<typeof projectApi.update>[1]) => projectApi.update(projectId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
}

export function useGetOneProject(projectId: string|undefined) {
	return useQuery({
		queryKey: ['projects', projectId],
		queryFn: () => projectApi.show(projectId!),
		enabled: !!projectId,
	});

}