'use client';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { CirclePlus } from 'lucide-react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/drawer';
import { useDisclosure } from '@heroui/use-disclosure';
import { useEffect, useState } from 'react';
import AddMembers from './AddMembers';
import { Divider } from '@heroui/divider';

// Form schema
const schema = z.object({
  groupName: z
    .string()
    .nonempty()
    .min(3, { message: 'Group name must be at least 3 characters' })
    .max(50, { message: 'Group name must be less than 50 characters' })
    .refine((value) => /^[a-zA-Z0-9_ -]+$/.test(value), {
      message:
        'Group name can only contain letters, numbers, space, underscores, and hyphens',
    }),
  groupDescription: z
    .string()
    .max(100, { message: 'Group description must be less than 100 characters' })
    .optional()
    .refine((value) => value === undefined || /^[a-zA-Z0-9_ -]+$/.test(value), {
      message:
        'Group description can only contain letters, numbers, space, underscores, and hyphens',
    }),
});
// Form values type
type FormValues = z.infer<typeof schema>;

export default function AddGroupDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [groupId, setGroupId] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const {
    handleSubmit,
    reset,
    control,
    formState,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      groupName: '',
    },
  });
  // reset fields when form is submitted successfully
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ groupName: '', groupDescription: '' });
    }
  }, [formState, isSubmitSuccessful, reset]);

  //   to reset the state if drawer is closed without adding friends before
  useEffect(() => {
    if (!isOpen) {
      setGroupId('');
      setGroupName('');
    }
  }, [isOpen]);

  //submit data
  const onSubmit = async (data: FormValues) => {
    console.log(data);
    setGroupId('group1245');
    setGroupName(data.groupName);
  };

  return (
    <div>
      <Button
        onPress={onOpen}
        isIconOnly
        radius='full'
        variant='faded'
        color='primary'
        aria-label='Add Group'
      >
        <CirclePlus />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className='max-h-[88vh]'
        placement='bottom'
        backdrop='blur'
      >
        <DrawerContent className='min-h-[400px]'>
          {(onClose) => (
            <>
              <DrawerHeader className='flex flex-col gap-1'>
                {groupId && groupName ? groupName : 'Create Group'}
              </DrawerHeader>
              <Divider />
              <DrawerBody>
                {groupId && groupName ? (
                  // add members section
                  <div>
                    <AddMembers groupId={groupId} groupName={groupName} />
                  </div>
                ) : (
                  // create group form
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='my-6 flex w-full flex-col gap-4'>
                      <Controller
                        control={control}
                        name='groupName'
                        render={({
                          field: { name, value, onChange, onBlur, ref },
                          fieldState: { invalid, error },
                        }) => (
                          <Input
                            maxLength={50}
                            ref={ref}
                            isRequired
                            errorMessage={error?.message}
                            validationBehavior='aria'
                            isInvalid={invalid}
                            label='Group name'
                            name={name}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        )}
                        rules={{ required: 'Name is required.' }}
                      />
                      <Controller
                        control={control}
                        name='groupDescription'
                        render={({
                          field: { name, value, onChange, onBlur, ref },
                          fieldState: { invalid, error },
                        }) => (
                          <Textarea
                            ref={ref}
                            errorMessage={error?.message}
                            validationBehavior='aria'
                            isInvalid={invalid}
                            label='Description'
                            maxRows={4}
                            maxLength={100}
                            name={name}
                            variant='faded'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        )}
                      />
                      <Button
                        variant='solid'
                        color='primary'
                        type='submit'
                        size='lg'
                        isLoading={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting' : 'Create'}
                      </Button>
                    </div>
                  </Form>
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color='danger' variant='bordered' onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
