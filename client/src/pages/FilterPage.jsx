// src/pages/FilterPage.jsx - Component chung cho Color và Style
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import FilterBar from '../components/FilterBar';
import axiosClient from '../utils/axiosClient';
import { useFilter } from '../context/FilterContext';
import '../style/CategoryPage.css';

// Map cho Colors
const COLOR_MAP = {
  'cam': { id: 1, name: 'Cam', displayName: 'Hoa Màu Cam' },
  'den': { id: 2, name: 'Đen', displayName: 'Hoa Màu Đen' },
  'do': { id: 3, name: 'Đỏ', displayName: 'Hoa Màu Đỏ' },
  'hong': { id: 4, name: 'Hồng', displayName: 'Hoa Màu Hồng' },
  'kem': { id: 5, name: 'Kem', displayName: 'Hoa Màu Kem' },
  'tim': { id: 6, name: 'Tím', displayName: 'Hoa Màu Tím' },
  'trang': { id: 7, name: 'Trắng', displayName: 'Hoa Màu Trắng' },
  'vang': { id: 8, name: 'Vàng', displayName: 'Hoa Màu Vàng' },
  'xanh-la': { id: 9, name: 'Xanh Lá', displayName: 'Hoa Màu Xanh Lá' }
};

// Map cho Styles
const STYLE_MAP = {
  'binh': { id: 1, name: 'Bình', displayName: 'Hoa Bình' },
  'bo': { id: 2, name: 'Bó', displayName: 'Hoa Bó' },
  'gio': { id: 3, name: 'Giỏ', displayName: 'Hoa Giỏ' },
  'hoa-cuoi': { id: 4, name: 'Hoa Cưới', displayName: 'Hoa Cưới' },
  'hoa-de-ban': { id: 5, name: 'Hoa Để Bàn', displayName: 'Hoa Để Bàn' },
  'hop-hoa': { id: 6, name: 'Hộp Hoa', displayName: 'Hộp Hoa' },
  'ke': { id: 7, name: 'Kệ', displayName: 'Hoa Kệ' },
  'lang': { id: 8, name: 'Lẵng', displayName: 'Hoa Lẵng' }
};

// Helper function
const getPriceRangeValue = (minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return '';
  if (!minPrice && maxPrice === 500000) return 'under500';
  if (minPrice === 500000 && maxPrice === 700000) return '500to700';
  if (minPrice === 700000 && maxPrice === 1000000) return '700to1000';
  if (minPrice === 1000000 && !maxPrice) return 'above1000';
  return '';
};

const FilterPage = ({ addToCart, filterType }) => {
  const params = useParams();
  const { filters, setFilters } = useFilter();

  // Lấy slug từ params dựa trên filterType
  const slug = filterType === 'color' ? params.colorSlug : params.styleSlug;
  
  // Chọn map phù hợp
  const dataMap = filterType === 'color' ? COLOR_MAP : STYLE_MAP;
  const filterInfo = dataMap[slug];
  
  const title = filterInfo?.displayName || 'Hoa';
  const filterParam = filterType === 'color' ? 'color' : 'style';

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetSignal, setResetSignal] = useState(false);
  const isInitialMount = useRef(true);

  // Reset filters khi đổi filter
  useEffect(() => {
    console.log(`🔄 ${filterType} changed:`, slug);

    setFilters({ searchText: '', minPrice: null, maxPrice: null });
    setResetSignal(prev => !prev);
    window.scrollTo(0, 0);
  }, [slug, setFilters, filterType]);

  // Reset page khi filters change
  useEffect(() => {
    setPage(1);
  }, [filters.searchText, filters.minPrice, filters.maxPrice]);

  // Fetch products
  useEffect(() => {
    if (!filterInfo) {
      setError(`${filterType === 'color' ? 'Màu sắc' : 'Kiểu dáng'} không hợp lệ`);
      setLoading(false);
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.append(filterParam, filterInfo.id);
    query.append('page', page);
    if (filters.searchText) query.append('name', filters.searchText);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);

    console.log(`📡 Fetching products with ${filterType}:`, {
      slug,
      id: filterInfo.id,
      page,
      filters,
      queryString: query.toString()
    });

    axiosClient
      .get(`/api/products/filter?${query.toString()}`)
      .then(res => {
        console.log('✅ Products received:', res.data);
        
        const productsData = res.data.products || [];
        const paginationData = res.data.pagination || res.data;
        
        setProducts(productsData);
        setTotalPages(paginationData.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error(`❌ Lỗi khi lấy sản phẩm theo ${filterType}:`, err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [page, filters.searchText, filters.minPrice, filters.maxPrice, slug, filterInfo, filterParam, filterType]);

  const handleFilterChange = useCallback(({ searchText, minPrice, maxPrice }) => {
    console.log(`🔍 FilterPage handleFilterChange:`, { searchText, minPrice, maxPrice });
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

  const currentPriceRange = getPriceRangeValue(filters.minPrice, filters.maxPrice);

  return (
    <div className="category-page">
      {/* Header */}
      <div className={`category-header category-header-${filterType}`}>
        <div className="category-header-overlay"></div>
        <div className="category-header-content">
          <h1 className="category-title">{title}</h1>
          <p className="category-description">
            {filterType === 'color' 
              ? `Khám phá bộ sưu tập hoa ${filterInfo?.name.toLowerCase()} đẹp nhất`
              : `Khám phá bộ sưu tập ${filterInfo?.name.toLowerCase()} độc đáo`
            }
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="category-content">
        <div className="container">
          <div className="category-filter-section">
            <FilterBar
              key={`filter-${slug}-${resetSignal}`}
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
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
            </div>
          ) : (
            <>
              <ProductGrid products={products} addToCart={addToCart} />

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

export default FilterPage;