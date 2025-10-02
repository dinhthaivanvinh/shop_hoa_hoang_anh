// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div style={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} style={{ maxWidth: '100%', borderRadius: '8px' }} />
        <h3>{product.name}</h3>
        <p>{product.price.toLocaleString()}₫</p>
      </Link>
      <button
          onClick={() => addToCart(product)}
          style={styles.addToCartButton}
        >
          Thêm vào giỏ
        </button>
    </div>
  );
};

const styles = {
  card: {
    padding: '16px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '6px'
  },
  button: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#e91e63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  addToCartButton: {
    backgroundColor: '#e91e63',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px'
  }
};

export default ProductCard;
