// src/components/ProductCard.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAddToCart } from '../hooks/useAddToCart';
import '../style/ProductCard.css';

// Constants
const DESCRIPTION_MAX_LENGTH = 50;

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

const ProductCard = ({ product, addToCart }) => {
  const [imageError, setImageError] = useState(false);
  const { isAdding, handleAddToCart } = useAddToCart(addToCart);

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

  // FIX: Prevent scroll to top when adding to cart
  const onAddToCart = useCallback((e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event bubbling
    handleAddToCart(product, e);
  }, [handleAddToCart, product]);

  return (
    <article className="product-card">
      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="product-image-link"
        aria-label={`Xem chi tiết ${product.name}`}
      >
        <div className="product-image-wrapper">
          {imageError ? (
            <div className="product-image-placeholder">
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
      </Link>

      {/* Product Info */}
      <div className="product-content">
        <Link
          to={`/product/${product.id}`}
          className="product-info-link"
        >
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>

          {product.description && (
            <p className="product-description">
              {truncatedDescription}
            </p>
          )}
        </Link>

        {/* Price and Add to Cart */}
        <div className="product-actions">
          <div className="product-price-wrapper">
            {hasDiscount ? (
              <>
                <span className="product-price-original">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="product-price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="product-price">{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
            onClick={onAddToCart}
            disabled={isAdding}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            type="button"
          >
            {isAdding ? (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="btn-text">Đã thêm</span>
              </>
            ) : (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V3H20C20.5523 3 21 3.44772 21 4C21 4.55228 20.5523 5 20 5H19.9311L19.1305 18.1425C19.0645 19.7566 17.7457 21 16.1296 21H7.87036C6.25426 21 4.93551 19.7566 4.86949 18.1425L4.06888 5H4C3.44772 5 3 4.55228 3 4C3 3.44772 3.44772 3 4 3H9V2ZM11 3H13V2H11V3ZM6.07398 5L6.86519 17.9525C6.89365 18.5211 7.35501 19 7.87036 19H16.1296C16.645 19 17.1064 18.5211 17.1348 17.9525L17.926 5H6.07398Z" fill="currentColor" />
                  <path d="M9 8C9.55228 8 10 8.44772 10 9V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17V9C8 8.44772 8.44772 8 9 8Z" fill="currentColor" />
                  <path d="M15 8C15.5523 8 16 8.44772 16 9V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V9C14 8.44772 14.4477 8 15 8Z" fill="currentColor" />
                </svg>
                <span className="btn-text">Thêm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;