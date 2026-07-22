import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Reset window scroll when the route changes (SPA navigation keeps scroll by default). */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
