// src/components/ProductGrid.jsx
import ProductCard from './ProductCard';

const ProductGrid = ({ products, title, addToCart}) => {
  
  return (
    <>
      {title && <h2 style={{ color: '#e91e63' }}>{title}</h2>}

      <div style={styles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart}/>
        ))}
      </div>
    </>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '24px',
    marginTop: '20px'
  }
};

export default ProductGrid;
