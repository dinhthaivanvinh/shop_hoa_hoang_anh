// src/pages/CategoryPage.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
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

// Helper function to convert filters to price range string
const getPriceRangeValue = (minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return '';
  if (!minPrice && maxPrice === 500000) return 'under500';
  if (minPrice === 500000 && maxPrice === 700000) return '500to700';
  if (minPrice === 700000 && maxPrice === 1000000) return '700to1000';
  if (minPrice === 1000000 && !maxPrice) return 'above1000';
  return '';
};

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
  const isInitialMount = useRef(true);

  // Reset filters khi đổi category
  useEffect(() => {
    console.log('🔄 Category changed:', categorySlug);
    setImageError(false);

    // Reset filters
    setFilters({ searchText: '', minPrice: null, maxPrice: null });

    // Toggle reset signal to trigger FilterBar reset
    setResetSignal(prev => !prev);

    // Scroll to top
    window.scrollTo(0, 0);
  }, [categorySlug, setFilters]);

  // Reset page khi filters change
  useEffect(() => {
    setPage(1);
  }, [filters.searchText, filters.minPrice, filters.maxPrice]);

  // Fetch products
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.append('type', categorySlug);
    query.append('page', page);
    if (filters.searchText) query.append('name', filters.searchText);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);

    console.log('📡 Fetching products with:', {
      categorySlug,
      page,
      filters,
      queryString: query.toString()
    });

    axiosClient
      .get(`/api/products/category?${query.toString()}`)
      .then(res => {
        console.log('✅ Products received:', res.data.products.length);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm theo danh mục:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [page, filters.searchText, filters.minPrice, filters.maxPrice, categorySlug]);

  const handleFilterChange = useCallback(({ searchText, minPrice, maxPrice }) => {
    console.log('🔍 CategoryPage handleFilterChange:', { searchText, minPrice, maxPrice });
    setFilters({ searchText, minPrice, maxPrice });
  }, [setFilters]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading && isInitialMount.current) {
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

  // Get current price range value for FilterBar
  const currentPriceRange = getPriceRangeValue(filters.minPrice, filters.maxPrice);

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
              key={`filter-${categorySlug}-${resetSignal}`}
              onFilterChange={handleFilterChange}
              initialSearch={filters.searchText || ''}
              initialPrice={currentPriceRange}
              resetSignal={resetSignal}
            />
          </div>

          {/* Loading State */}
          {loading && !isInitialMount.current ? (
            <div className="loading-inline">
              <div className="loading-spinner-small"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : products.length === 0 ? (
          /* No Products */
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
            </div>
          ) : (
                /* Products Grid */
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
                        onPageChange={handlePageChange}
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