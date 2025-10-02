import React from 'react';
import "../style/CartPage.css"
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, updateQuantity, removeFromCart, clearCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleOrder = () => {
    if (cartItems.length === 0) return;
    navigate('/order');
  };

  return (
    <>
      <div className="cart-container">
        <h2>🛒 Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <p>Giỏ hàng đang trống.</p>
        ) : (
          <>
            <div className="cart-header">
              <div>Sản phẩm</div>
              <div>Số lượng</div>
              <div>Đơn giá</div>
              <div>Thành tiền</div>
              <div>Xóa</div>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-row">
                <div className="cart-product">
                  <img src={item.image} alt={item.name} className="cart-thumb" />
                  <span>{item.name}</span>
                </div>

                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1) updateQuantity(item.id, val);
                    }}
                  />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <div>{item.price.toLocaleString()}₫</div>
                <div><strong>{(item.price * item.quantity).toLocaleString()}₫</strong></div>

                <button onClick={() => removeFromCart(item.id)} className="cart-remove">Xóa</button>
              </div>
            ))}

            <div className="cart-footer">
              <div></div><div></div>
              <div>Tổng cộng:</div>
              <div className="cart-total">{total.toLocaleString()}₫</div>
              <button onClick={clearCart} className="cart-clear">🧹 Xóa tất cả</button>
            </div>
          </>
        )}
      </div>
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button
          onClick={handleOrder}
          disabled={cartItems.length === 0}
          style={{
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ✅ Đặt hàng
        </button>
      </div>
    </>

  );
};

export default CartPage;
