import { z } from 'zod';

export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	role: z.string().optional(),
	isActive: z.boolean().optional()
});
export type SessionUser = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
	email: z.string().email('Enter a valid email address'),
	password: z.string().min(1, 'Password is required')
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotSchema = z.object({
	email: z.string().email('Enter a valid email address')
});
export type ForgotInput = z.infer<typeof ForgotSchema>;

export const ResetSchema = z
	.object({
		token: z.string().min(1, 'Reset token is missing'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		passwordConfirm: z.string().min(1, 'Confirm your new password')
	})
	.refine((v) => v.password === v.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['passwordConfirm']
	});
export type ResetInput = z.infer<typeof ResetSchema>;
