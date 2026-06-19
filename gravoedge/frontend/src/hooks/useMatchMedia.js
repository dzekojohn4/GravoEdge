import { useEffect, useState } from 'react';

/**
 * Track whether a CSS media query matches the current viewport.
 *
 * @param {string} query - A CSS media query string (e.g. '(max-width: 768px)')
 * @returns {boolean} Whether the media query currently matches
 */
export const useMatchMedia = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleMediaQueryChange = (e) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [query]);

  return matches;
};
