import { Card, CardBody } from '@heroui/card';
import { SquareCheckBig } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function TransactionPendingCard() {
  return (
    <Card className='min-h-[500px]'>
      <CardBody className='item-center flex'>
        <header className='mt-3 flex flex-row items-center justify-center gap-4'>
          <h2 className='text-center text-lg font-semibold'>Request sent</h2>
          <SquareCheckBig color='green' />
        </header>
        <section className='mx-6 mt-4 flex flex-col items-center justify-center rounded-sm border pb-4 pt-5 shadow-md'>
          <Image
            loading='lazy'
            alt='qr code for request'
            src={
              'https://api.qrserver.com/v1/create-qr-code/?data=23b3423j34h234nn3k423&amp;size=100x100'
            }
            height={160}
            width={160}
          />
          <span className='pt-6 text-3xl font-bold text-primary-900'>
            278-282-839
          </span>
        </section>
        <footer className='mx-4 my-4 px-2 text-sm'>
          <p className='mb-2 w-full text-lg font-semibold'>
            To complete the transaction
          </p>
          <p className='mb-2 w-full font-semibold'>
            Using your friends moneybook,
          </p>
          <li>Scan the QR code above </li>
          <li>Or insert the digit code to complete the transaction</li>
          <p className='mt-5 font-light italic text-danger-600'>
            If not responded transaction will be automatically cancelled after
            24 hours
          </p>
        </footer>
      </CardBody>
    </Card>
  );
}
