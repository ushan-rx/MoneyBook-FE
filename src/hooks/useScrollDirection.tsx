import { useState, useEffect } from 'react';

export default function useScrollDirection(threshold = 10, debounceTime = 100) {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout) return;

      setScrollTimeout(
        setTimeout(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = Math.abs(currentScrollY - lastScrollY);

          if (scrollDiff > threshold) {
            setIsScrollingUp(currentScrollY < lastScrollY);
            setLastScrollY(currentScrollY);
          }

          setScrollTimeout(null);
        }, debounceTime)
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, threshold, debounceTime, scrollTimeout]);

  return isScrollingUp;
}
