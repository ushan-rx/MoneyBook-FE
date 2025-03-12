'use client';
import { Button, ButtonGroup } from '@heroui/button';
import { Divider } from '@heroui/divider';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/drawer';
import { useDisclosure } from '@heroui/modal';
import { CirclePlus, HandCoins, Users } from 'lucide-react';
import React from 'react';
import CreatePersonalTransaction from './CreatePersonalTransaction';
import CreateMutualTransaction from './CreateMutualTransaction';

export default function AddTransactionDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formType, setFormType] = React.useState('personal');
  const [success, setSuccess] = React.useState<boolean>(false);

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
        placement='bottom'
        backdrop='blur'
        isDismissable={false}
      >
        <DrawerContent className='max-h-[88vh] min-h-[400px]'>
          {(onClose) => (
            <>
              <DrawerHeader className='flex flex-col text-xl text-primary-900'>
                Create Transaction
              </DrawerHeader>
              <Divider />
              <DrawerBody>
                <section className='flex justify-around'>
                  <ButtonGroup>
                    <Button
                      name='personal'
                      aria-label='add persaonal transaction'
                      {...(formType === 'personal' && { color: 'primary' })}
                      startContent={<HandCoins />}
                      onPress={() => setFormType('personal')}
                    >
                      Personal
                    </Button>
                    <Button
                      aria-label='add mutual transaction'
                      startContent={<Users />}
                      {...(formType === 'mutual' && { color: 'primary' })}
                      onPress={() => setFormType('mutual')}
                    >
                      <span>Mutual</span>
                    </Button>
                  </ButtonGroup>
                </section>
                {formType === 'mutual' && <CreateMutualTransaction />}
                {formType === 'personal' && <CreatePersonalTransaction />}
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
