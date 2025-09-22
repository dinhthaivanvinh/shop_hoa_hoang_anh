// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Category } from '../data/category';
import ProductGrid from '../components/ProductGrid';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CategoryPage = ( {addToCart} ) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const { categorySlug } = useParams();
  const categoryMap = {
    'sinh-nhat': Category.SinhNhat,
    'khai-truong': Category.KhaiTruong,
    'tang-le': Category.TangLe
  };
  const selectedCategory = categoryMap[categorySlug];

  useEffect(() => {
    axios
      .get(`/api/products/category?type=${selectedCategory}&page=${page}`)
      .then(res => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      });
  }, [selectedCategory, page]);

  if (!selectedCategory) {
    return <h2>❌ Loại hoa không tồn tại.</h2>;
  }

  const title = `🌸 ${selectedCategory.replace(/([A-Z])/g, ' $1').trim()}`;
  
  return (
    <>
      <ProductGrid addToCart={addToCart} products={products} title={title} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>

  );
};

export default CategoryPage;
