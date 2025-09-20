import {email, z} from 'zod'

export const signupSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(8)
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(8)
    }),
});