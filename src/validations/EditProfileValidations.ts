import * as z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  profilePicture: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
