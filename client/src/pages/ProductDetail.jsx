import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/ProductDetail.css'; // 👉 Tách CSS riêng cho dễ quản lý
import axiosClient from '../utils/axiosClient';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (!product) return <h2 className="not-found">Sản phẩm không tồn tại.</h2>;

  return (
    <div className="product-detail-container">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      </div>
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">{product.price.toLocaleString()}₫</p>
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
