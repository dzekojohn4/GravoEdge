
import { useEffect } from 'react';

function useLockBodyScroll(lock) {
  useEffect(() => {
    if (lock) {
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.height = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [lock]);
}

export default useLockBodyScroll;