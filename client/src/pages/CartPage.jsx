// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/CartPage.css';

const CartPage = ({ cartItems, updateQuantity, removeFromCart, clearCart }) => {
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 30000 : 0; // 30k phí ship
  const total = subtotal + shipping;

  const handleOrder = () => {
    if (cartItems.length === 0) return;
    navigate('/order');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Page Header */}
        <div className="cart-page-header">
          <h1 className="cart-title">
            <span className="cart-icon">🛒</span>
            Giỏ Hàng Của Bạn
          </h1>
          <p className="cart-subtitle">
            {cartItems.length > 0
              ? `Bạn có ${cartItems.length} sản phẩm trong giỏ hàng`
              : 'Giỏ hàng đang trống'}
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="empty-cart">
            <div className="empty-cart-icon">🌸</div>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              <span className="btn-icon">🌺</span>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
            <div className="cart-content">
              {/* Cart Items Section */}
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <h3>Sản phẩm ({cartItems.length})</h3>
                </div>

                <div className="cart-items-list">
                  {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    formatPrice={formatPrice}
                  />
                ))}
                </div>

                {/* Clear Cart Button */}
                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={clearCart}>
                    <span className="btn-icon">🗑️</span>
                    Xóa tất cả
                  </button>
                  <button className="continue-shopping-link" onClick={handleContinueShopping}>
                    ← Tiếp tục mua sắm
                  </button>
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="cart-summary-section">
                <div className="cart-summary">
                  <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>

                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row summary-total">
                    <span>Tổng cộng:</span>
                    <span className="total-price">{formatPrice(total)}</span>
                  </div>

                  <button className="checkout-btn" onClick={handleOrder}>
                    <span className="btn-icon">✓</span>
                    Đặt Hàng Ngay
                  </button>

                  <div className="cart-features">
                    <div className="feature-item">
                      <span className="feature-icon">✅</span>
                      <span>Miễn phí đổi trả trong 7 ngày</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🚚</span>
                      <span>Giao hàng nhanh 2-4 giờ</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">💯</span>
                      <span>Cam kết hoa tươi 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, updateQuantity, removeFromCart, formatPrice }) => {
  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 1 && val <= 99) {
      updateQuantity(item.id, val);
    }
  };

  const incrementQuantity = () => {
    if (item.quantity < 99) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">{formatPrice(item.price)}</p>

        {/* Mobile Price Total */}
        <div className="cart-item-mobile-total">
          <span className="mobile-label">Thành tiền:</span>
          <span className="mobile-price">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>

      <div className="cart-item-quantity">
        <button
          className="quantity-btn quantity-decrease"
          onClick={decrementQuantity}
          disabled={item.quantity <= 1}
          aria-label="Giảm số lượng"
        >
          −
        </button>
        <input
          type="number"
          className="quantity-input"
          value={item.quantity}
          onChange={handleQuantityChange}
          min="1"
          max="99"
          aria-label="Số lượng"
        />
        <button 
          className="quantity-btn quantity-increase"
          onClick={incrementQuantity}
          disabled={item.quantity >= 99}
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        {formatPrice(item.price * item.quantity)}
      </div>

      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(item.id)}
        aria-label={`Xóa ${item.name}`}
      >
        <span className="remove-icon">×</span>
      </button>
    </div>
  );
};

export default CartPage;