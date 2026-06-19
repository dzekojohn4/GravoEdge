import { useEffect } from 'react';

/**
 * Lock or unlock body scroll by toggling a CSS class.
 *
 * @param {boolean} lock - When true, adds 'no-scroll' class to body and html
 * @returns {void}
 */
function useLockBodyScroll(lock) {
  useEffect(() => {
    if (lock) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [lock]);
}

export default useLockBodyScroll;
