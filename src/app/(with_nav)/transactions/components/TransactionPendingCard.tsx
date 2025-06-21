import Image from 'next/image';
import React from 'react';

interface QrPayload {
  transactionID: string;
  otpHash: string;
}

interface TransactionPendingCardProps {
  otp: string;
  qrPayload: QrPayload;
}

export default function TransactionPendingCard({
  otp,
  qrPayload,
}: TransactionPendingCardProps) {
  const frontendBaseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';

  const responseUrl = `${frontendBaseUrl}/mutual-transactions/response/${qrPayload.transactionID}?otpHash=${qrPayload.otpHash}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    responseUrl
  )}&size=150x150`;

  // Format OTP like 123-456
  const formattedOtp = otp ? otp.replace(/(\d{3})(?=\d)/g, '$1-') : '';

  return (
    <div className='flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center shadow-sm'>
      <h2 className='text-2xl font-semibold'>Transaction Pending</h2>
      <p className='mt-2 max-w-sm'>
        Show this QR code or provide the OTP to your friend to complete the
        transaction.
      </p>
      <div className='mt-6'>
        <Image
          src={qrCodeUrl}
          alt='Transaction QR Code'
          width={150}
          height={150}
          priority
        />
      </div>
      <p className='text-muted-foreground mt-6 text-sm uppercase tracking-wider'>
        One-Time Password (OTP)
      </p>
      <span className='pt-2 text-3xl font-bold text-primary-900'>
        {formattedOtp}
      </span>
    </div>
  );
}
