// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryTitle } from '../data/category';
import ProductGrid from '../components/ProductGrid';
import axiosClient from '../utils/axiosClient';
import Pagination from '../components/Pagination';
import '../style/CategoryPage.css'

const CategoryPage = ( {addToCart} ) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const { categorySlug } = useParams();
  const categoryTitleMap = {
    'sinh-nhat': CategoryTitle.SinhNhat,
    'khai-truong': CategoryTitle.KhaiTruong,
    'tang-le': CategoryTitle.TangLe
  };
  const selectedCategoryTitle = categoryTitleMap[categorySlug];

  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setPage(1);
  }, [searchText, minPrice, maxPrice, categorySlug]);

  useEffect(() => {
    // Reset filter khi chuyển category
    resetFilter();
  }, [categorySlug]);

  const resetFilter = () => {
    setSearchText('');
    setPriceRange('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  }

  useEffect(() => {
    const query = new URLSearchParams();
    query.append('type', categorySlug);
    query.append('page', page);
    if (searchText) query.append('name', searchText);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);

    axiosClient
      .get(`/api/products/category?${query.toString()}`)
      .then(res => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      });
  }, [page, searchText, minPrice, maxPrice, categorySlug]);

  const title = `🌸 ${selectedCategoryTitle.replace(/([A-Z])/g, ' $1').trim()}`;

  const filterPrice = (e) => {
    const value = e.target.value;
    setPriceRange(value);

    // Gán min/max tương ứng
    switch (value) {
      case 'under500':
        setMinPrice('');
        setMaxPrice('500000');
        break;
      case '500to700':
        setMinPrice('500000');
        setMaxPrice('700000');
        break;
      case '700to1000':
        setMinPrice('700000');
        setMaxPrice('1000000');
        break;
      case 'above1000':
        setMinPrice('1000000');
        setMaxPrice('');
        break;
      default:
        setMinPrice('');
        setMaxPrice('');
    }
  };
  
  return (
    <>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Tìm sản phẩm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={priceRange}
          onChange={(e) => filterPrice(e)}
        >
          <option value="">-- Khoảng giá --</option>
          <option value="under500">Dưới 500.000₫</option>
          <option value="500to700">500.000₫ - 700.000₫</option>
          <option value="700to1000">700.000₫ - 1.000.000₫</option>
          <option value="above1000">Trên 1.000.000₫</option>
        </select>

        <button
          className="clear-filter-icon"
          onClick={() => resetFilter()}
          title="Xóa bộ lọc"
        >
          ❌
        </button>

      </div>

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
