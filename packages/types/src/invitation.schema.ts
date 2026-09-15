import z, { email } from 'zod'

export const createInvitationSchema = z.object({
	email: z.email('Please enter a valid email')
})

export type CreateInvitationSchema = z.infer<typeof createInvitationSchema>