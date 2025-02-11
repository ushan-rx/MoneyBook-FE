import React from 'react';

export default function LoadingDots() {
  return (
    <div className='flex h-screen items-center justify-center space-x-2 bg-transparent'>
      <span className='sr-only'>Loading...</span>
      <div className='h-4 w-4 animate-bounce rounded-full bg-primary-600/60 [animation-delay:-0.3s]'></div>
      <div className='h-4 w-4 animate-bounce rounded-full bg-primary-600/60 [animation-delay:-0.15s]'></div>
      <div className='h-4 w-4 animate-bounce rounded-full bg-primary-600/60'></div>
    </div>
  );
}
