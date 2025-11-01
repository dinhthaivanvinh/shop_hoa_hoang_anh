// src/pages/OrderPage.jsx
import React from 'react';
import OrderForm from '../components/OrderForm';
import { useNavigate } from 'react-router-dom';
import '../style/OrderPage.css';

const OrderPage = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="order-page">
        <div className="empty-order">
          <div className="empty-order-icon">🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <button className="back-to-shop-btn" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-container">
        {/* Page Header */}
        <div className="order-page-header">
          <button className="back-btn" onClick={() => navigate('/cart')}>
            ← Quay lại giỏ hàng
          </button>
          <h1 className="order-title">
            <span className="title-icon">📝</span>
            Đặt Hàng
          </h1>
          <p className="order-subtitle">
            Vui lòng điền thông tin để hoàn tất đơn hàng
          </p>
        </div>

        <div className="order-content">
          {/* Order Form Section */}
          <div className="order-form-section">
            <OrderForm cartItems={cartItems} clearCart={clearCart} />
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h3 className="summary-title">
                <span className="summary-icon">📋</span>
                Tóm Tắt Đơn Hàng
              </h3>

              {/* Cart Items */}
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-quantity">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              {/* Pricing */}
              <div className="summary-pricing">
                <div className="pricing-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="pricing-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="pricing-row pricing-total">
                  <span>Tổng cộng:</span>
                  <span className="total-amount">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="order-features">
                <div className="feature-item">
                  <span>Giao hàng nhanh 2-4 giờ</span>
                </div>
                <div className="feature-item">
                  <span>Cam kết hoa tươi 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;