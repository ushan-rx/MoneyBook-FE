import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import React from 'react';

export default function LoginSection() {
  return (
    <div className='mb-8 mt-20 flex flex-col gap-10 px-10'>
      <header className='flex flex-col items-center justify-center gap-4 text-center'>
        <h1 className='mb-1 text-2xl font-extrabold text-primary-600'>
          MONEYBOOK
        </h1>
        <p className='font-bold'>
          Track, manage, and split expenses
          <span className='font-bold text-slate-600 dark:text-slate-300'>
            {' '}
            effortlessly!
          </span>
        </p>
      </header>
      <Card className='min-w-[250px]'>
        <CardHeader className='flex flex-col justify-center text-center'>
          <h2 className='mb-2 text-xl font-bold text-slate-700 dark:text-slate-300'>
            Log in to continue
          </h2>
          <Divider />
        </CardHeader>
        <CardBody className='pb-8'>
          <Button size='lg' radius='lg' variant='bordered'>
            <div className='flex items-center justify-center'>
              {/* Google icon svg */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                className='h-6 w-6'
                viewBox='0 0 48 48'
              >
                <defs>
                  <path
                    id='a'
                    d='M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z'
                  />
                </defs>
                <clipPath id='b'>
                  <use xlinkHref='#a' overflow='visible' />
                </clipPath>
                <path clipPath='url(#b)' fill='#FBBC05' d='M0 37V11l17 13z' />
                <path
                  clipPath='url(#b)'
                  fill='#EA4335'
                  d='M0 11l17 13 7-6.1L48 14V0H0z'
                />
                <path
                  clipPath='url(#b)'
                  fill='#34A853'
                  d='M0 37l30-23 7.9 1L48 0v48H0z'
                />
                <path
                  clipPath='url(#b)'
                  fill='#4285F4'
                  d='M48 48L17 24l-4-3 35-10z'
                />
              </svg>
              <span className='ml-4 font-semibold text-slate-700 dark:text-slate-100'>
                Log in with Google
              </span>
            </div>
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
