import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email('Please enter a valid email').trim(),
    password: z.string().min(8, 'Password must be atleast 8 characters').max(64, 'Password must not exceed 64 characters'),
    remember: z.boolean()
});

export const registerSchema = z.object({
    firstName: z.string().min(2, 'Name must be atleast 2 characters').max(64, 'Name must not exceed 64 characters').trim(),
    lastName: z.string().min(2, 'Name must be atleast 2 characters').max(64, 'Name must not exceed 64 characters').trim(),
    email: z.email('Please enter a valid email').trim(),
    password: z.string().min(8, 'Password must be atleast 8 characters').max(64, 'Password must not exceed 64 characters'),
    confirmPassword: z.string().min(8, 'Password must be atleast 8 characters').max(64, 'Password must not exceed 64 characters')
})
.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
