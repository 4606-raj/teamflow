import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional().default(false),
});

export type LoginDto = z.infer<typeof loginSchema>;
