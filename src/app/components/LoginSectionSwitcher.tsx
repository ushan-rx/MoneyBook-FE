'use client';
import React from 'react';
import { motion } from 'framer-motion';
import InfoSection from './InfoSection';
import LoginSection from './LoginSection';
import Image from 'next/image';
import { Button } from '@heroui/button';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

export default function LoginSectionSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className='flex h-fit flex-col items-center'>
      <motion.div
        className={`fixed inset-0 flex h-fit flex-col items-center justify-center bg-white transition-all ${
          isOpen ? 'overflow-hidden' : ''
        }`}
        animate={{ y: isOpen ? '-38%' : '0%', opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className='relative flex flex-col items-center'>
          {/* Login Section (Fades Out When Open) */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoginSection />
          </motion.div>

          {/* Piggy Bank Image with Scale Animation */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: isOpen ? 0.6 : 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Image
              alt='piggy bank image'
              src={'/images/piggy-bank.png'}
              width={300}
              height={300}
            />
          </motion.div>

          {/* Info Section (Fades In When Open) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={isOpen ? '' : 'hidden'}
          >
            <InfoSection />
          </motion.div>
        </div>
      </motion.div>
      {/* Toggle Button */}
      <Button
        className='fixed bottom-8'
        size='lg'
        isIconOnly
        variant='light'
        onPress={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronsDown
            size={100}
            className='text-slate-600 dark:text-slate-300'
          />
        ) : (
          <ChevronsUp
            size={100}
            className='text-slate-600 dark:text-slate-300'
          />
        )}
      </Button>
    </div>
  );
}
