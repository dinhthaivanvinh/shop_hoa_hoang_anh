// src/pages/ProductDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <h2>Sản phẩm không tồn tại.</h2>;

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <img src={product.image} alt={product.name} style={{ width: '400px', borderRadius: '8px' }} />
      <div>
        <h2>{product.name}</h2>
        <p style={{ color: '#e91e63', fontWeight: 'bold' }}>{product.price.toLocaleString()}₫</p>
        <p>{product.description}</p>
        <button
          onClick={() => addToCart(product)}
          style={{ marginTop: '12px', padding: '10px 16px', backgroundColor: '#e91e63', color: '#fff', border: 'none', borderRadius: '6px' }}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
