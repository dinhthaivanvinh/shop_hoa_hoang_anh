// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryTitle } from '../data/category';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import axiosClient from '../utils/axiosClient';
import { useFilter } from '../context/FilterContext';
import '../style/CategoryPage.css';

const CategoryPage = ({ addToCart }) => {
  const { categorySlug } = useParams();
  const { filters, setResetSignal } = useFilter();

  const categoryTitleMap = {
    'sinh-nhat': CategoryTitle.SinhNhat,
    'khai-truong': CategoryTitle.KhaiTruong,
    'tang-le': CategoryTitle.TangLe
  };

  const categoryIconMap = {
    'sinh-nhat': '🎂',
    'khai-truong': '🎉',
    'tang-le': '🕯️'
  };

  const categoryDescMap = {
    'sinh-nhat': 'Chúc mừng sinh nhật với những bó hoa tươi thắm',
    'khai-truong': 'Hoa khai trương - Chúc mừng thành công rực rỡ',
    'tang-le': 'Hoa tang lễ - Thành kính viếng tiễn người đã khuất'
  };

  const selectedCategoryTitle = categoryTitleMap[categorySlug];
  const categoryIcon = categoryIconMap[categorySlug] || '🌸';
  const categoryDesc = categoryDescMap[categorySlug] || '';
  const title = selectedCategoryTitle.replace(/([A-Z])/g, ' $1').trim();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset filter signal khi đổi danh mục
  useEffect(() => {
    setResetSignal(true);
    const timer = setTimeout(() => setResetSignal(false), 100);
    return () => clearTimeout(timer);
  }, [categorySlug, setResetSignal]);

  // Reset trang về 1 khi đổi bộ lọc hoặc danh mục
  useEffect(() => {
    setPage(1);
  }, [filters, categorySlug]);

  // Gọi API sản phẩm theo danh mục và bộ lọc
  useEffect(() => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.append('type', categorySlug);
    query.append('page', page);
    if (filters.searchText) query.append('name', filters.searchText);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);

    axiosClient
      .get(`/api/products/category?${query.toString()}`)
      .then(res => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm theo danh mục:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [page, filters, categorySlug]);

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header">
        <div className="category-header-content">
          <div className="category-icon-wrapper">
            <span className="category-icon">{categoryIcon}</span>
          </div>
          <div className="category-info">
            <h1 className="category-title">{title}</h1>
            <p className="category-description">{categoryDesc}</p>
            <div className="category-stats">
              <span className="stat-item">
                📦 {products.length > 0 ? `${products.length} sản phẩm` : 'Đang cập nhật'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="category-content">
        <div className="container">
          {products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
            </div>
          ) : (
              <>
                <ProductGrid
                  products={products}
                  addToCart={addToCart}
                />

                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(newPage) => {
                        setPage(newPage);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;