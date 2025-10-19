// src/components/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import '../style/ScrollToTopButton.css';

/**
 * ScrollToTopButton - Floating button to scroll to top
 * Shows when user scrolls down, hides when at top
 * 
 * @param {number} showAfter - Show button after scrolling X pixels (default: 300)
 */
const ScrollToTopButton = ({ showAfter = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Scroll to top"
          title="Lên đầu trang"
        >
          <span className="scroll-icon">↑</span>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;