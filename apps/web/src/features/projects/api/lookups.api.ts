import { api } from '@/shared/api/api'

export interface LookupItem {
	id: string
	name: string
}

export interface SelectOption {
	label: string
	value: string
}

const getLookupOptions = async (url: string): Promise<SelectOption[]> => {
	const response = await api.get<LookupItem[]>(url)

	return response.data.map(({ id, name }) => ({
		label: name,
		value: id,
	}))
}

export const lookupsApi = {
	tags(): Promise<SelectOption[]> {
		return getLookupOptions('lookups/tags')
	},

	technologies(): Promise<SelectOption[]> {
		return getLookupOptions('lookups/technologies')
	}
}