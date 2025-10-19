// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryTitle } from '../data/category';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import FilterBar from '../components/FilterBar';
import axiosClient from '../utils/axiosClient';
import { useFilter } from '../context/FilterContext';
import '../style/CategoryPage.css';

// Import banner images
import bannerKhaiTruong from '../assets/banners/khai-truong-banner.jpg';
import bannerSinhNhat from '../assets/banners/sinh-nhat-banner.jpg';
import bannerTangLe from '../assets/banners/tang-le-banner.jpg';

const CategoryPage = ({ addToCart }) => {
  const { categorySlug } = useParams();
  const { filters, setFilters } = useFilter();

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
    'sinh-nhat': 'Thêm tươi, thêm yêu đời',
    'khai-truong': 'Hoa Khai Trương',
    'tang-le': 'Hoa nói thay lời vĩnh biệt'
  };

  const categorySubtitleMap = {
    'sinh-nhat': 'Hoa Sinh Nhật',
    'khai-truong': 'SHOP NOW!',
    'tang-le': 'HOA Tang Lễ'
  };

  const categoryBannerMap = {
    'sinh-nhat': bannerSinhNhat,
    'khai-truong': bannerKhaiTruong,
    'tang-le': bannerTangLe
  };

  const categoryZaloMap = {
    'sinh-nhat': 'ZALO: 0378776399',
    'khai-truong': 'ZALO: 0378776399',
    'tang-le': 'ZALO: 0378776399'
  };

  const selectedCategoryTitle = categoryTitleMap[categorySlug];
  const categoryIcon = categoryIconMap[categorySlug] || '🌸';
  const categoryDesc = categoryDescMap[categorySlug] || '';
  const categorySubtitle = categorySubtitleMap[categorySlug] || '';
  const categoryBanner = categoryBannerMap[categorySlug];
  const categoryZalo = categoryZaloMap[categorySlug] || '';
  const title = selectedCategoryTitle.replace(/([A-Z])/g, ' $1').trim();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);

  // Reset filter signal khi đổi danh mục
  useEffect(() => {
    setResetSignal(true);
    setImageError(false);
    setFilters({ searchText: '', minPrice: null, maxPrice: null });
    const timer = setTimeout(() => setResetSignal(false), 100);
    return () => clearTimeout(timer);
  }, [categorySlug, setFilters]);

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

  const handleFilterChange = ({ searchText, minPrice, maxPrice }) => {
    setFilters({ searchText, minPrice, maxPrice });
  };

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
      {/* Category Header with Banner Image */}
      <div
        className={`category-header category-header-${categorySlug}`}
        style={{
          backgroundImage: !imageError && categoryBanner
            ? `url(${categoryBanner})`
            : 'none'
        }}
      >
        <div className="category-header-overlay"></div>
        {/* <div className="category-header-content">
          <div className="category-banner-text">
            <div className="category-icon-wrapper">
              <span className="category-icon">{categoryIcon}</span>
            </div>
            <div className="category-info">
              <p className="category-subtitle">{categorySubtitle}</p>
              <h1 className="category-title">{categoryDesc}</h1>
              <div className="category-stats">
                <span className="stat-item stat-zalo">
                  {categoryZalo}
                </span>
                <span className="stat-item stat-count">
                  📦 {products.length > 0 ? `${products.length} sản phẩm` : 'Đang cập nhật'}
                </span>
              </div>
            </div>
          </div>

          {categoryBanner && !imageError && (
            <div className="category-banner-preview">
              <img
                src={categoryBanner}
                alt={`${title} banner`}
                className="banner-preview-image"
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div> */}

        {/* Fallback banner if image fails to load */}
        {imageError && (
          <img
            src={categoryBanner}
            alt={`${title} banner`}
            className="category-banner-fallback"
            style={{ display: 'none' }}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Filter Bar */}
      <div className="category-content">
        <div className="container">
          <div className="category-filter-section">
            <h2 className="filter-section-title">
              🔍 Tìm Kiếm Sản Phẩm
            </h2>
            <FilterBar
              onFilterChange={handleFilterChange}
              initialSearch={filters.searchText || ''}
              initialPrice=""
              resetSignal={resetSignal}
            />
          </div>

          {/* Products Grid */}
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