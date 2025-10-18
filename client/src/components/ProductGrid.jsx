// src/components/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';
import '../style/ProductGrid.css';

const ProductGrid = ({ products, title, addToCart }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-grid-wrapper">
      {title && (
        <div className="grid-header">
          <h2 className="grid-title">{title}</h2>
          <div className="grid-count">
            {products.length} sản phẩm
          </div>
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;