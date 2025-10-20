// src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import '../style/HeroSlider.css'

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      desktop: '/images/1.jpg',
      mobile: '/images/1-mb.jpg',
      alt: 'Shop Hoa Hoàng Anh - Giao hàng toàn quốc'
    },
    {
      id: 2,
      desktop: '/images/2.jpg',
      mobile: '/images/2-mb.jpg',
      alt: 'Cung cấp hoa tươi - Miễn phí giao nội thành'
    },
    {
      id: 3,
      desktop: '/images/3.jpg',
      mobile: '/images/3-mb.jpg',
      alt: 'Biến mọi dịp trở nên đặc biệt'
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {/* Slides */}
        <div 
          className="slides-wrapper" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <picture>
                {/* Mobile: màn hình < 768px */}
                <source
                  media="(max-width: 767px)"
                  srcSet={slide.mobile}
                />
                {/* Desktop: màn hình >= 768px */}
                <source
                  media="(min-width: 768px)"
                  srcSet={slide.desktop}
                />
                {/* Fallback cho trình duyệt không hỗ trợ <picture> */}
                <img
                  src={slide.desktop}
                  alt={slide.alt}
                  loading="lazy"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          className="slider-arrow slider-arrow-left" 
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button 
          className="slider-arrow slider-arrow-right" 
          onClick={goToNext}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Dots Navigation */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;