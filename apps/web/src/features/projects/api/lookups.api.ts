import { api } from '@/shared/api/api'

export interface LookupItem {
	id: string
	name: string
}

export interface SelectOption {
	label: string
	value: string
}

export interface MemberOption {
	id: string
	name: string
	email: string
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
	},

	members(): Promise<MemberOption[]> {
		return api.get<{ user: { id: string; firstName: string | null; lastName: string | null; email: string } }[]>('organizations/members')
			.then((response) => response.data.map(({ user }) => ({
				id: user.id,
				name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
				email: user.email,
			})))
	}
}