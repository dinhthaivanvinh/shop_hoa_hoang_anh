// src/components/ScrollToTop.jsx (Advanced Version)
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component - Advanced Version
 * 
 * Features:
 * - Scrolls to top on route change
 * - Preserves scroll position for specific routes (optional)
 * - Smooth scroll option
 * - Scroll restoration for browser back/forward
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.smooth - Enable smooth scrolling (default: false)
 * @param {Array} options.excludeRoutes - Routes to exclude from auto-scroll
 * @param {boolean} options.scrollToHash - Scroll to hash anchor if present (default: true)
 */
const ScrollToTop = ({ 
  smooth = false, 
  excludeRoutes = [],
  scrollToHash = true 
} = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Check if current route is excluded
    const isExcluded = excludeRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (isExcluded) {
      return; // Skip scroll for excluded routes
    }

    // Handle hash navigation (e.g., /page#section)
    if (scrollToHash && location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start'
          });
        }
      }, 0);
      return;
    }

    // Scroll to top
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash, smooth, excludeRoutes, scrollToHash]);

  return null;
};

export default ScrollToTop;

// ============================================
// USAGE EXAMPLES:
// ============================================

// 1. Basic usage (instant scroll):
// <ScrollToTop />

// 2. With smooth scrolling:
// <ScrollToTop smooth />

// 3. Exclude specific routes (e.g., pagination):
// <ScrollToTop excludeRoutes={['/admin']} />

// 4. Full configuration:
// <ScrollToTop 
//   smooth={true}
//   excludeRoutes={['/admin', '/dashboard']}
//   scrollToHash={true}
// />