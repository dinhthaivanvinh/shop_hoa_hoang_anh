// src/components/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/ProductDetail.css';
import axiosClient from '../utils/axiosClient';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    setLoading(true);
    setError(null);

    axiosClient.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm:', err);
        setError('Không thể tải thông tin sản phẩm');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);

    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    // Show success state
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1); // Reset quantity after adding
    }, 1000);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">⚠️</div>
        <h2>Sản phẩm không tồn tại</h2>
        <p>{error || 'Không tìm thấy sản phẩm này'}</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Quay về trang chủ
        </button>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')}>Trang chủ</button>
          <span className="separator">›</span>
          <span className="current">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="product-detail-content">
          {/* Image Section */}
          <div className="product-image-section">
            <div className="product-image-wrapper">
              {imageError ? (
                <div className="image-placeholder">
                  <span className="placeholder-text">Hình ảnh không khả dụng</span>
                </div>
              ) : (
                <img
                  src={product.image || '/placeholder-flower.jpg'}
                  alt={product.name}
                  className="product-detail-image"
                  onError={() => setImageError(true)}
                />
              )}

              {/* Badges */}
              {hasDiscount && (
                <span className="discount-badge">-{discountPercent}%</span>
              )}
              {product.isNew && (
                <span className="new-badge">Mới</span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="product-info-section">
            <h1 className="product-detail-name">{product.name}</h1>

            {/* Price */}
            <div className="product-price-section">
              {hasDiscount ? (
                <>
                  <span className="product-price-current">{formatPrice(product.price)}</span>
                  <span className="product-price-original">{formatPrice(product.originalPrice)}</span>
                  <span className="discount-label">Tiết kiệm {formatPrice(product.originalPrice - product.price)}</span>
                </>
              ) : (
                <span className="product-price-current">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="product-description-section">
                <h3 className="section-title">Mô tả sản phẩm</h3>
                <p className="product-description">{product.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="product-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Hoa tươi 100%</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Giao hàng nhanh</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label className="quantity-label">Số lượng:</label>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('increase')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className={`add-to-cart-btn-detail ${isAdding ? 'adding' : ''}`}
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className="btn-icon">✓</span>
                    <span>Đã thêm vào giỏ</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛒</span>
                    <span>Thêm vào giỏ hàng</span>
                  </>
                )}
              </button>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <span className="contact-label">Hotline</span>
                  <a href="tel:0123456789" className="contact-value">0123 456 789</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;