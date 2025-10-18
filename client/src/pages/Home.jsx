// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import HeroSlider from '../components/HeroSlider';
import axiosClient from '../utils/axiosClient';
import { useFilter } from '../context/FilterContext';
import '../style/Home.css';

const Home = ({ addToCart }) => {
  const { filters } = useFilter();
  const [rawData, setRawData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axiosClient.get('/api/products/home')
      .then(res => {
        setRawData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm trang chủ:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const { searchText, minPrice, maxPrice } = filters;

    const filtered = {};
    Object.entries(rawData).forEach(([slug, { label, products }]) => {
      const matched = products.filter(p => {
        const matchName = searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true;
        const matchMin = minPrice ? p.price >= Number(minPrice) : true;
        const matchMax = maxPrice ? p.price <= Number(maxPrice) : true;
        return matchName && matchMin && matchMax;
      });

      if (matched.length > 0) {
        filtered[slug] = { label, products: matched };
      }
    });

    setFilteredData(filtered);
  }, [rawData, filters]);

  if (loading) {
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

  const hasResults = Object.keys(filteredData).length > 0;

  return (
    <div className="home">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Quick Categories */}
      <section className="quick-categories">
        <div className="container">
          <div className="quick-category-grid">
            <a href="/category/khai-truong" className="quick-category-card">
              <div className="quick-category-icon">🎉</div>
              <h3>Hoa Khai Trương</h3>
              <p>Chúc mừng thành công</p>
            </a>
            <a href="/category/sinh-nhat" className="quick-category-card">
              <div className="quick-category-icon">🎂</div>
              <h3>Hoa Sinh Nhật</h3>
              <p>Chúc mừng ngày đặc biệt</p>
            </a>
            <a href="/category/tang-le" className="quick-category-card">
              <div className="quick-category-icon">🕯️</div>
              <h3>Hoa Tang Lễ</h3>
              <p>Thành kính viếng tiễn</p>
            </a>
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <div className="container">
        {!hasResults ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
          </div>
        ) : (
          Object.entries(filteredData).map(([slug, { label, products }]) => (
            <section key={slug} className="category-section">
              <SectionHeader title={`🌸 ${label}`} link={`/category/${slug}`} />
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