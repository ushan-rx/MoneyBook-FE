'use client';
import { Button } from '@heroui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MyGroupStatCard from '../components/MyGroupStatCard';
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import GroupDetailsDrawer from '../components/GroupDetailsDrawer';

export default function GroupPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const controls = useAnimation();

  useEffect(() => {
    // Trigger animation of page stat on component mount (page load)
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 8,
        duration: 0.5,
      },
    });
  }, [controls]);

  return (
    <div>
      <div>
        <div className='relative z-50 flex justify-center border-b-foreground-500 bg-blue-600/80 p-2 align-middle text-white shadow-md dark:border-blue-900 dark:bg-blue-950 dark:text-white/90'>
          <Button
            onPress={() => router.back()}
            className='absolute left-0 ml-2 border-blue-600/90 bg-transparent text-white'
            variant='faded'
            isIconOnly
          >
            <ChevronLeft />
          </Button>
          <h1 className='m-1 text-2xl'>group</h1>
          <GroupDetailsDrawer />
        </div>
        <main>
          <section className='relative dark:bg-black'>
            <motion.div initial={{ y: -15, opacity: 0 }} animate={controls}>
              <MyGroupStatCard />
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}
