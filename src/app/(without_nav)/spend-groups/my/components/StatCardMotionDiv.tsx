'use client';
import MyGroupStatCard from '../components/MyGroupStatCard';
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
export default function StatCardMotionDiv() {
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
    <motion.div initial={{ y: -15, opacity: 0 }} animate={controls}>
      <MyGroupStatCard />
    </motion.div>
  );
}
