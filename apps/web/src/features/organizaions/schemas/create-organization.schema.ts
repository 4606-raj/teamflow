import z from 'zod'

export const createOrganizationSchema = z.object({
    name: z.string('Please enter a valid value').min(3, "Min 3 letters")
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>