'use client';
import { useDisclosure } from '@heroui/use-disclosure';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/drawer';
import { Button } from '@heroui/button';
import { MenuIcon } from 'lucide-react';
import { Divider } from '@heroui/divider';
import Image from 'next/image';
import DeleteGroup from './DeleteGroup';
import DateTimeComponent from '@/components/DateTimeComponent';

interface groupMamberList {
  id: string;
  name: string;
  imageUrl: string;
}

interface groupDetails {
  groupId: string;
  name: string;
  createdAt: string;
  description: string;
}

const groupMembers: groupMamberList[] = [
  {
    id: '1',
    name: 'Neil Sims',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
  },
  {
    id: '2',
    name: 'Micheal Brown',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
  },
  {
    id: '3',
    name: 'John Doe',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
  },
  {
    id: '4',
    name: 'Jane Doe',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
  },
  {
    id: '5',
    name: 'Jane Doe',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
  },
  {
    id: '6',
    name: 'Jane Doe',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
  },
  {
    id: '7',
    name: 'Jane Doe',
    imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
  },
];

const groupDetails = {
  groupId: '1',
  name: 'Group 1',
  description: 'This is a group description',
  createdAt: '2021-10-10',
};

export default function GroupDetailsDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button
        onPress={onOpen}
        className='absolute right-0 mr-2 border-blue-600/90 bg-transparent text-white'
        variant='faded'
        isIconOnly
      >
        <MenuIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        isDismissable={false}
        onOpenChange={onOpenChange}
        size='md'
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className='flex flex-col gap-1 bg-blue-600/80 font-medium text-white dark:bg-blue-950'>
                Group Details
              </DrawerHeader>
              <DrawerBody>
                <div>
                  <section className='mb-0 mt-3 flex flex-col gap-2 rounded-md border bg-primary-50/20 py-3 text-center'>
                    <span className='px-2 text-lg font-semibold'>
                      {groupDetails.name && groupDetails.name}
                    </span>
                    <span className='mb-2 px-2'>
                      {groupDetails.description && groupDetails.description}
                    </span>
                    <p className='px-2 font-thin italic text-slate-500'>
                      created at{' '}
                      <span>
                        {groupDetails.createdAt && (
                          <DateTimeComponent
                            dateString={groupDetails.createdAt}
                            type='default'
                          />
                        )}
                      </span>
                    </p>
                  </section>
                  <Divider className='mt-3 dark:bg-slate-50' />
                  <section className='mb-4 flex flex-col'>
                    <header className='pb-2 pt-4 text-lg'>Group Members</header>
                    <main>
                      <ul className='max-h-[40vh] overflow-y-auto rounded-sm border border-slate-200/40 px-4 shadow-inner dark:border-slate-500'>
                        {groupMembers.map((member) => (
                          <li key={member.id}>
                            <div className='flex items-center gap-4 py-2'>
                              <Image
                                height={20}
                                width={20}
                                src={member.imageUrl}
                                alt={member.name}
                                className='h-8 w-8 rounded-full'
                              />
                              <span className='text-md'>{member.name}</span>
                            </div>
                            <Divider />
                          </li>
                        ))}
                      </ul>
                    </main>
                  </section>
                  <div className='flex w-full justify-end'>
                    <DeleteGroup groupId={groupDetails.groupId} />
                  </div>
                </div>
              </DrawerBody>
              <Divider />
              <DrawerFooter>
                <Button color='danger' variant='solid' onPress={onClose}>
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
