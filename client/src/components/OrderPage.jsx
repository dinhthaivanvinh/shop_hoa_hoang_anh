// src/pages/OrderPage.jsx
import React from 'react';
import OrderForm from '../components/OrderForm';
import { useNavigate } from 'react-router-dom';

const OrderPage = ({cartItems, clearCart}) => {
  const navigate = useNavigate();
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Không có sản phẩm nào trong giỏ hàng.</p>
        <button onClick={() => navigate('/cart')}>Quay lại giỏ hàng</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>📝 Đặt hàng</h2>
      <OrderForm cartItems={cartItems} clearCart={clearCart} />
    </div>
  );
};

export default OrderPage;
