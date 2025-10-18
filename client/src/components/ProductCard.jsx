// src/components/ProductCard.jsx (Alternative version with custom hook)
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

  const onAddToCart = useCallback((e) => {
    handleAddToCart(product, e);
  }, [handleAddToCart, product]);

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

      {/* Product Footer - Outside Link */}
      <div className="product-footer">
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
        >
          {isAdding ? (
            <>
              <span className="btn-icon">✓</span>
              <span className="btn-text">Đã thêm</span>
            </>
          ) : (
            <>
              <span className="btn-icon">🛒</span>
              <span className="btn-text">Thêm</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;