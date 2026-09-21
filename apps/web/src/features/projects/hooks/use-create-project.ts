import { useMutation, useQueryClient } from '@tanstack/react-query';
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