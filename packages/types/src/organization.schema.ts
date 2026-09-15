import z from 'zod'

export const createOrganizationSchema = z.object({
    name: z.string('Please enter a valid value').min(3, "Min 3 letters")
});

export const switchOrganizationSchema = z.object({
    organizationId: z.string('Provide a valid organizationId').cuid()
})

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>
export type SwitchOrganizationSchema = z.infer<typeof switchOrganizationSchema>