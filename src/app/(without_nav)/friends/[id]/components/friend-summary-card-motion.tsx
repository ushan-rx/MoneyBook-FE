'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { FriendSummaryCard } from './friend-summary-card';
import type { FriendSummary } from '@/types/TransactionTypes';

interface FriendSummaryCardMotionProps {
  summary: FriendSummary;
  isVisible: boolean;
}

export function FriendSummaryCardMotion({
  summary,
  isVisible,
}: FriendSummaryCardMotionProps) {
  const controls = useAnimation();

  useEffect(() => {
    // Trigger animation on component mount (page load)
    controls.start({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 8,
        duration: 0.5,
      },
    });
  }, [controls]);

  useEffect(() => {
    // Handle visibility changes with smooth animations
    if (isVisible) {
      controls.start({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 12,
          duration: 0.4,
        },
      });
    } else {
      controls.start({
        y: -100,
        opacity: 0,
        scale: 0.95,
        transition: {
          type: 'spring',
          stiffness: 120,
          damping: 15,
          duration: 0.3,
        },
      });
    }
  }, [isVisible, controls]);

  return (
    <motion.div
      initial={{ y: -15, opacity: 0 }}
      animate={controls}
      className='sticky top-16 z-10'
    >
      <FriendSummaryCard summary={summary} isVisible={true} />
    </motion.div>
  );
}
