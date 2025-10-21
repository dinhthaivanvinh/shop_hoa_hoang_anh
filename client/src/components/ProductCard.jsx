// src/components/ProductCard.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../style/ProductCard.css';

// Constants
const DESCRIPTION_MAX_LENGTH = 50;
const ADD_TO_CART_SUCCESS_DELAY = 1000;

// Utility functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

// Shopping Cart Icon Component
const CartIcon = () => (
  <svg
    className="cart-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V3H19C19.5523 3 20 3.44772 20 4V5H21C21.5523 5 22 5.44772 22 6V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6C2 5.44772 2.44772 5 3 5H4V4C4 3.44772 4.44772 3 5 3H9V2ZM9 5H15V4H9V5ZM6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"
      fill="currentColor"
    />
  </svg>
);

// Checkmark Icon Component
const CheckmarkIcon = () => (
  <svg
    className="cart-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
      fill="currentColor"
    />
  </svg>
);

const ProductCard = ({ product, addToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Memoized values
  const hasDiscount = useMemo(() => 
    product.originalPrice && product.originalPrice > product.price,
    [product.originalPrice, product.price]
  );

  const truncatedDescription = useMemo(() => 
    truncateText(product.description, DESCRIPTION_MAX_LENGTH),
    [product.description]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle add to cart WITHOUT scrolling to top
  const handleAddToCart = useCallback(async (e) => {
    // Prevent default link behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);

    try {
      await addToCart(product);

      // Reset button state after delay
      setTimeout(() => {
        setIsAdding(false);
      }, ADD_TO_CART_SUCCESS_DELAY);
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ hàng:', error);
      setIsAdding(false);
    }
  }, [isAdding, addToCart, product]);

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`} 
        className="product-card-link"
        aria-label={`Xem chi tiết ${product.name}`}
      >
        {/* Product Image */}
        <div className="product-image-wrapper">
          {imageError ? (
            <div className="product-image-placeholder">
              <span className="placeholder-icon">🌸</span>
              <span className="placeholder-text">Hình ảnh không khả dụng</span>
            </div>
          ) : (
            <img
              src={product.image || '/placeholder-flower.jpg'}
              alt={product.name}
              className="product-image"
              onError={handleImageError}
              loading="lazy"
            />
          )}

          {/* Badges */}
          {product.isNew && (
            <span className="product-badge badge-new">Mới</span>
          )}
          {product.discount && (
            <span className="product-badge badge-sale">-{product.discount}%</span>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>

          {product.description && (
            <p className="product-description">
              {truncatedDescription}
            </p>
          )}
        </div>
      </Link>

      {/* Product Footer - Outside Link to prevent scroll */}
      <div className="product-footer">
        {/* Price */}
        <div className="product-price-wrapper">
          {hasDiscount ? (
            <>
              <span className="product-price-original">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="product-price">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="product-price">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
          type="button"
        >
          {isAdding ? (
            <>
              <CheckmarkIcon />
              <span className="btn-text">Đã thêm</span>
            </>
          ) : (
            <>
              <CartIcon />
              <span className="btn-text">Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;