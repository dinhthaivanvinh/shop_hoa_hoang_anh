import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderForm = ({ cartItems, clearCart }) => {
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    note: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('orderForm');
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);


  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
    localStorage.setItem('orderForm', JSON.stringify(updatedForm));
  };

  const validateForm = () => {
    for (const key in form) {
      if (!form[key].trim()) {
        setError(`Vui lòng nhập ${key.replace('_', ' ')}`);
        return false;
      }
    }

    if (!/^\d{9,11}$/.test(form.phone)) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }

    if (cartItems.length === 0) {
      setError('Giỏ hàng đang trống');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const res = await axios.post('/api/orders', {
        ...form,
        items
      });

      setSuccess(`✅ Đặt hàng thành công! Mã đơn: ${res.data.order_id}`);
      toast.info("🎉 Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ sớm liên hệ với bạn.")
      clearCart(); // 🧹 Xóa giỏ hàng sau khi đặt
      localStorage.removeItem('orderForm'); // Xóa dữ liệu cũ nếu cần
    } catch (err) {
      setError("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      marginTop: '30px'
    }}>
      <h3 style={{ marginBottom: '16px' }}>📝 Thông tin đặt hàng</h3>

      <input
        type="text"
        name="customer_name"
        placeholder="Tên người đặt"
        value={form.customer_name}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="phone"
        placeholder="Số điện thoại"
        value={form.phone}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="address"
        placeholder="Địa chỉ nhận hàng"
        value={form.address}
        onChange={handleChange}
        style={inputStyle}
      />
      <textarea
        name="note"
        placeholder="Ghi chú"
        value={form.note}
        onChange={handleChange}
        style={{ ...inputStyle, height: '80px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button type="submit" style={{
        backgroundColor: '#2196f3',
        color: '#fff',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '12px'
      }}>
        ✅ Đặt hàng
      </button>
    </form>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

export default OrderForm;
