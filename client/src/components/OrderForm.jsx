// src/components/OrderForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { toast } from 'react-toastify';
import '../style/OrderForm.css';

const OrderForm = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Load saved form data
  useEffect(() => {
    const saved = localStorage.getItem('orderForm');
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved form:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Save to localStorage
    localStorage.setItem('orderForm', JSON.stringify(updatedForm));

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'customer_name':
        if (!value.trim()) {
          error = 'Vui lòng nhập tên người đặt';
        } else if (value.trim().length < 2) {
          error = 'Tên phải có ít nhất 2 ký tự';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(value.replace(/\s/g, ''))) {
          error = 'Số điện thoại không hợp lệ (VD: 0912345678)';
        }
        break;

      case 'address':
        if (!value.trim()) {
          error = 'Vui lòng nhập địa chỉ nhận hàng';
        } else if (value.trim().length < 10) {
          error = 'Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn';
        }
        break;

      case 'note':
        // Note is optional, no validation needed
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(form).forEach(field => {
      if (field !== 'note') { // Note is optional
        const valid = validateField(field, form[field]);
        if (!valid) {
          isValid = false;
        }
      }
    });

  // Check cart
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      isValid = false;
    }

    // Mark all fields as touched
    setTouched({
      customer_name: true,
      phone: true,
      address: true,
      note: true
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const res = await axiosClient.post('/api/orders', {
        ...form,
        items
      });

      // Success
      toast.success(`🎉 Đặt hàng thành công! Mã đơn: ${res.data.order_id}`);

      // Clear cart and form
      clearCart();
      localStorage.removeItem('orderForm');

      // Navigate to success page or home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('Order error:', err);
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form-container">
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">📋</span>
            Thông Tin Đặt Hàng
          </h3>
          <p className="form-subtitle">Vui lòng điền đầy đủ thông tin bên dưới</p>
        </div>

        {/* Customer Name */}
        <div className="form-group">
          <label htmlFor="customer_name" className="form-label">
            <span className="label-icon">👤</span>
            Tên người đặt <span className="required">*</span>
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            placeholder="Nguyễn Văn A"
            value={form.customer_name}
            onChange={handleChange}
            onBlur={() => handleBlur('customer_name')}
            className={`form-input ${errors.customer_name && touched.customer_name ? 'error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.customer_name && touched.customer_name && (
            <span className="error-message">{errors.customer_name}</span>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <span className="label-icon">📞</span>
            Số điện thoại <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="0912345678"
            value={form.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.phone && touched.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            <span className="label-icon">📍</span>
            Địa chỉ nhận hàng <span className="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="123 Đường Lê Duẩn, Phường Phú Nhuận, TP. Huế"
            value={form.address}
            onChange={handleChange}
            onBlur={() => handleBlur('address')}
            className={`form-input ${errors.address && touched.address ? 'error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.address && touched.address && (
            <span className="error-message">{errors.address}</span>
          )}
        </div>

        {/* Note */}
        <div className="form-group">
          <label htmlFor="note" className="form-label">
            <span className="label-icon">📝</span>
            Ghi chú (Tùy chọn)
          </label>
          <textarea
            id="note"
            name="note"
            placeholder="VD: Giao vào buổi sáng, gọi trước 30 phút..."
            value={form.note}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="btn-spinner"></span>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span className="btn-icon">✅</span>
              <span>Xác Nhận Đặt Hàng</span>
            </>
          )}
        </button>

        {/* Info Note */}
        <div className="form-note">
          <span className="note-icon">ℹ️</span>
          <p>
            Chúng tôi sẽ liên hệ với bạn trong vòng <strong>30 phút</strong> để xác nhận đơn hàng.
          </p>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;