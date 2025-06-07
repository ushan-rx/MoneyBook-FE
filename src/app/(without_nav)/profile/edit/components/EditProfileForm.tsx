'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  profileSchema,
  type ProfileFormValues,
} from '@/validations/EditProfileValidations';
import { useUser } from '@/hooks/useUser';
import api from '@/lib/api';
import { addToast } from '@heroui/toast';
import { uploadImage } from '@/lib/uploadUtils';
import { Textarea } from '@/components/ui/textarea';

export default function EditProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string>('/placeholder.svg');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      profilePicture: '',
      bio: '',
    },
  });

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      try {
        const response = await api.get(`users/${user.userId}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch user details');
        }

        const userData = response.data?.data;
        console.log('Fetched user data:', userData);
        // Set profile picture if available
        if (userData.profilePicture) {
          setPreviewImage(userData.profilePicture);
        }

        // Reset form with fetched data
        form.reset(userData);
      } catch (error: any) {
        addToast({
          title: 'Error loading profile',
          description: error.message,
          color: 'danger',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user, form]);

  // Handle image drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Revoke previous object URL to prevent memory leaks
        if (previewImage && previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
        setProfileImageFile(file);

        // Set the current profilePicture value in the form to maintain state
        // This will be updated with the actual URL after upload
        form.setValue('profilePicture', 'pending_upload');
      }
    },
    [previewImage, form]
  );

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);

      let profilePictureUrl = data.profilePicture;

      // Only upload if there's a new profile image file
      if (profileImageFile) {
        profilePictureUrl = await uploadImage(
          profileImageFile,
          'profile_pictures'
        );
        console.log('Uploaded image URL:', profilePictureUrl);
        // Update the form data with the new URL
        form.setValue('profilePicture', profilePictureUrl);
      }
      // updated data object with the correct profile picture URL
      const updatedData = {
        ...data,
        profilePicture: profilePictureUrl,
      };

      // Update user data
      if (user?.userId) {
        const response = await api.put(`users/${user.userId}`, updatedData);

        if (response.status === 200) {
          addToast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully',
            color: 'success',
            timeout: 1500,
          });
          setTimeout(() => {
            router.push('/profile');
          }, 1500); // Redirect after a short delay
        }
      }
    } catch (error: any) {
      console.log('Error updating profile:', error.response.data.data);
      const errors = error.response.data.data as Object; // Access error messages comes from backend
      addToast({
        title: 'Failed to update profile',
        description: Object.values(errors).join('/n '), // Join error messages with newline
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className='space-y-6'>
          <div className='flex flex-col items-center'>
            <div className='mb-4 size-24 overflow-hidden rounded-full border-2 border-primary'>
              <Image
                src={previewImage || '/placeholder.svg'}
                alt='Profile picture'
                width={96}
                height={96}
                className='size-full object-cover'
              />
            </div>

            <div
              {...getRootProps()}
              className={`w-full cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-mutedForeground/20'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className='mx-auto mb-2 size-6' />
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <CardFooter>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
