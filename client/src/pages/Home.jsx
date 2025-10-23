// src/pages/Home.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import HeroSlider from '../components/HeroSlider';
import FilterBar from '../components/FilterBar';
import axiosClient from '../utils/axiosClient';
import { useFilter } from '../context/FilterContext';
import '../style/Home.css';
import khaiTruongHd from '../assets/hd/khai-truong-hd.jpg';
import sinhNhatHd from '../assets/hd/sinh-nhat-hd.jpg';
import tangLeHd from '../assets/hd/tang-le-hd.jpg';

const Home = ({ addToCart }) => {
  const { filters, setFilters } = useFilter();
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetSignal, setResetSignal] = useState(false);
  const isInitialMount = useRef(true);
  const location = useLocation();

  // Reset filters when navigating to Home page
  useEffect(() => {
    // Reset filters
    setFilters({ searchText: '', minPrice: null, maxPrice: null });

    // Toggle reset signal to trigger FilterBar reset
    setResetSignal(prev => !prev);

    // Scroll to top
    window.scrollTo(0, 0);
  }, [location.pathname, setFilters]);

  // Fetch products từ API với filters
  useEffect(() => {
    // Skip initial mount để không call API 2 lần
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setLoading(true);
    } else {
      setLoading(true);
    }

    setError(null);

    // Build query params
    const query = new URLSearchParams();
    if (filters.searchText) query.append('name', filters.searchText);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);

    const url = query.toString()
      ? `/api/products/home?${query.toString()}`
      : '/api/products/home';

    axiosClient.get(url)
      .then(res => {
        setProductData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm trang chủ:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = useCallback(({ searchText, minPrice, maxPrice }) => {
    setFilters({ searchText, minPrice, maxPrice });
  }, [setFilters]);

  // Chỉ show loading lần đầu
  if (loading && isInitialMount.current) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          🔄 Thử lại
        </button>
      </div>
    );
  }

  const hasResults = Object.keys(productData).length > 0;

  return (
    <div className="home">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Quick Categories */}
      <section className="quick-categories">
        <div className="container">
          <div className="quick-category-grid">
            <a href="/category/khai-truong" className="quick-category-card">
              <img src={khaiTruongHd} alt='Khai Trương' className="quick-category-card-image" />
            </a>
            <a href="/category/sinh-nhat" className="quick-category-card">
              <img src={sinhNhatHd} alt='Sinh Nhật' className="quick-category-card-image" />
            </a>
            <a href="/category/tang-le" className="quick-category-card">
              <img src={tangLeHd} alt='Tang Lễ' className="quick-category-card-image" />
            </a>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="container">
        <div className="filter-section">
          <FilterBar
            key={`home-filter-${resetSignal}`}
            onFilterChange={handleFilterChange}
            initialSearch={filters.searchText || ''}
            initialPrice=""
            resetSignal={resetSignal}
          />
        </div>
      </div>

      {/* Products by Category */}
      <div className="container">
        {loading && !isInitialMount.current ? (
          <div className="loading-inline">
            <div className="loading-spinner-small"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        ) : !hasResults ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
          </div>
        ) : (
              Object.entries(productData).map(([slug, { label, products }]) => (
            <section key={slug} className="category-section">
                  <SectionHeader title={`${label}`} link={`/category/${slug}`} />
              <ProductGrid products={products} addToCart={addToCart} />
            </section>
          ))
        )}
      </div>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🌺</div>
              <h3>Hoa Tươi Chất Lượng</h3>
              <p>Nhập khẩu trực tiếp từ các vườn hoa uy tín</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👨‍🎨</div>
              <h3>Thiết Kế Chuyên Nghiệp</h3>
              <p>Đội ngũ florist giàu kinh nghiệm</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Giao Hàng Nhanh Chóng</h3>
              <p>Giao trong vòng 2 giờ nội thành</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💯</div>
              <h3>Cam Kết Hoàn Tiền</h3>
              <p>100% hoàn tiền nếu không hài lòng</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;