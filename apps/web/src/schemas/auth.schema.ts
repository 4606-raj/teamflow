import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email('Please enter a valid email').trim(),
    password: z.string().min(8, 'Password must be atleast 8 characters').max(64, 'Password must not exceed 64 characters'),
    remember: z.boolean()
});

export type LoginSchema = z.infer<typeof loginSchema>