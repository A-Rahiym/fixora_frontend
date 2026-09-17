import { z } from 'zod';

export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	role: z.string().optional(),
	isActive: z.boolean().optional()
});
export type SessionUser = z.infer<typeof UserSchema>;

/** Raw user shape from the backend (UserResource): snake_case, role object. */
export const UserResourceSchema = z.looseObject({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	email_verified_at: z.string().nullable().optional(),
	is_active: z.boolean(),
	role: z
		.object({
			id: z.number(),
			name: z.string(),
			label: z.string(),
			permissions: z.array(z.string())
		})
		.nullable()
		.optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional()
});
export type UserResource = z.infer<typeof UserResourceSchema>;

/** POST /api/v1/auth/login response envelope. */
export const LoginResponseSchema = z.object({
	data: z.object({
		token: z.string().min(1),
		user: UserResourceSchema
	}),
	message: z.string()
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/** Map the backend user shape onto the canonical session user. */
export function toSessionUser(resource: UserResource): SessionUser {
	return {
		id: resource.id,
		name: resource.name,
		email: resource.email,
		role: resource.role?.name,
		isActive: resource.is_active
	};
}

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
