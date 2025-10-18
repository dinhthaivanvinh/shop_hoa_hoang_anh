// src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import '../style/HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/images/1.png', // Thay bằng đường dẫn thực tế của bạn
      alt: 'Shop Hoa Hoàng Anh - Giao hàng toàn quốc'
    },
    {
      id: 2,
      image: '/images/2.png',
      alt: 'Cung cấp hoa tươi - Miễn phí giao nội thành'
    },
    {
      id: 3,
      image: '/images/3.png',
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
              <img src={slide.image} alt={slide.alt} />
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