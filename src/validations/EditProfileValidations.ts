import * as z from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9]\d{1,10}$/, 'Invalid phone number format'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address cannot exceed 255 characters'),
  bio: z
    .string()
    .min(1, 'Bio is required')
    .max(100, 'Bio cannot exceed 100 characters'),
  profilePicture: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
