import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';

export default function ProfileCard() {
  const [isRequested, setIsRequested] = React.useState(false);
  return (
    <div>
      <Card>
        <CardHeader className='justify-center'>
          <div>
            <Avatar
              isBordered
              radius='full'
              size='lg'
              src='https://heroui.com/avatars/avatar-1.png'
              className='mt-2 justify-self-center'
            />
            <div className='mt-4 flex flex-col gap-1 text-center'>
              <h4 className='text-medium font-semibold leading-none text-default-600'>
                Zoey Lang
              </h4>
              <h5 className='text-small tracking-tight text-default-400'>
                @zoeylang
              </h5>
            </div>
          </div>
        </CardHeader>
        <CardBody className='px-3 py-0 text-center text-small text-default-400'>
          <p>
            Frontend developer and UI/UX enthusiast. Join me on this coding
            adventure!
          </p>

          <div className='flex-raw mx-2 mb-1 mt-4 flex justify-between'>
            <div className='flex gap-1'>
              <p className='text-small font-semibold text-default-400'>4</p>
              <p className='text-small text-default-400'>Friends</p>
            </div>
            <div className='flex gap-1'>
              <p className='text-small font-semibold text-default-400'>97.1K</p>
              <p className='text-small text-default-400'>Score</p>
            </div>
          </div>
          <Divider />
        </CardBody>
        <CardFooter className='justify-center gap-3'>
          <Button
            className={
              isRequested
                ? 'border-default-200 bg-transparent text-foreground'
                : ''
            }
            color='primary'
            radius='full'
            size='sm'
            variant={isRequested ? 'bordered' : 'solid'}
            onPress={() => setIsRequested(!isRequested)}
          >
            {isRequested ? 'Cancel' : 'Request'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
