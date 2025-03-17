import React from 'react';
import LoginSectionSwitcher from './components/LoginSectionSwitcher';

export default function page() {
  return (
    <div className='flex flex-col items-center gap-8 px-8'>
      <LoginSectionSwitcher />
    </div>
  );
}
