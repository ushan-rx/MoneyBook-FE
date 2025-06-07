'use client';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/store/user-store';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, {
      message: 'First name must not exceed 50 characters',
    }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, {
      message: 'Last name must not exceed 50 characters',
    }),
  bio: z
    .string()
    .min(2, { message: 'Bio must be at least 2 characters' })
    .max(100, {
      message: 'Bio must not exceed 100 characters',
    }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Please enter a valid phone number' })
    .regex(/^[0-9+\-\s()]*$/, {
      message: 'Phone number can only contain digits, spaces, and +()-',
    }),
  address: z
    .string()
    .min(5, { message: 'Please enter a valid address' })
    .max(255, {
      message: 'Address must not exceed 255 characters',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserDetailsForm() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Get user from the store
  const user = useUserStore((state) => state.user);
  const updateUserInStore = useUserStore((state) => state.updateUser);

  // Check if the user is allowed to access this page
  useEffect(() => {
    const checkAccess = async () => {
      if (user === undefined) {
        return; // user store Still loading, don't check access yet
      }

      if (user?.userId) {
        const isNewUser = !user.firstName || !user.lastName || !user.email;
        if (isNewUser) {
          setIsAuthorized(true);
        } else {
          // User already has profile data, redirect to home
          console.log('User already has profile data, redirecting to home');
          router.replace('/home');
        }
      } else if (user === null) {
        // If user is null (not authenticated), redirect to login
        console.log('User not authenticated, redirecting to login');
        router.replace('/');
      }
      // If user is undefined (still loading), wait for it to resolve
      setIsChecking(false);
    };

    checkAccess();
  }, [user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      bio: '',
    },
  });

  // Set up the mutation with TanStack Query
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!user?.userId) {
        throw new Error('User ID not found');
      }
      // add profile picture to the data
      const updatedData = {
        ...data,
        profilePicture: user.profilePicture || '', // Use existing profile picture if available
      };

      const response = await api.put(`/users/${user.userId}`, updatedData);

      // Update local store with new user data
      updateUserInStore({
        ...user,
        ...updatedData,
      });

      return response.data;
    },
    onSuccess: () => {
      router.push('/home'); // Redirect after success
    },
    onError: (error) => {
      console.error('Failed to update user data:', error);
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  // Show loading while checking authorization or user is loading
  if (isChecking || !user?.userId) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
        <span className='ml-2'>Verifying access...</span>
      </div>
    );
  }

  // prevent showing the form to unauthorized users
  if (!isAuthorized) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
        <span className='ml-2'>Redirecting...</span>
      </div>
    );
  }

  // Show the onboarding form if authorized
  return (
    <div className='container m-auto px-6 py-8 md:py-12'>
      <Card className='mx-auto max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Complete Your Profile
          </CardTitle>
          <CardDescription className='text-center'>
            Please provide your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input size={15} placeholder='John' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className='resize-none text-xs'
                        rows={3}
                        maxLength={100}
                        placeholder='Hey there!!'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='+1 (555) 123-4567' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123 Main St, City, State, ZIP'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>

              {mutation.isError && (
                <p className='mt-2 text-center text-sm text-red-500'>
                  An error occurred. Please try again.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
