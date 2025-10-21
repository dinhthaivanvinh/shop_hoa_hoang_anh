// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import '../style/Layout.css';
import ScrollToTopButton from './ScrollToTopButton';
import logoImage from '../assets/logo.png'; // 👈 Import logo

const Layout = ({ children, cartCount }) => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header cartCount={cartCount} />
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <img
                  src={logoImage}
                  alt="Hoàng Anh Logo"
                  className="footer-logo-image"
                />
              </div>
              <p>
                Shop hoa tươi uy tín với hơn 10 năm kinh nghiệm.
                Chúng tôi cam kết mang đến những bó hoa tươi đẹp nhất cho mọi dịp đặc biệt.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  📘
                </a>
                <a href="https://instagram.com" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  📷
                </a>
                <a href="https://zalo.me" className="social-link" aria-label="Zalo" target="_blank" rel="noopener noreferrer">
                  💬
                </a>
                <a href="tel:0123456789" className="social-link" aria-label="Phone" target="_blank" rel="noopener noreferrer">
                  📞
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3>Liên Kết</h3>
              <a href="/">Trang Chủ</a>
              <a href="/category/khai-truong">Hoa Khai Trương</a>
              <a href="/category/sinh-nhat">Hoa Sinh Nhật</a>
              <a href="/category/tang-le">Hoa Tang Lễ</a>
              <a href="/contact">Liên Hệ</a>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3>Hỗ Trợ Khách Hàng</h3>
              <a href="/huong-dan-dat-hang">Hướng dẫn đặt hàng</a>
              <a href="/chinh-sach-doi-tra">Chính sách đổi trả</a>
              <a href="/phuong-thuc-thanh-toan">Phương thức thanh toán</a>
              <a href="/chinh-sach-bao-mat">Chính sách bảo mật</a>
              <a href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</a>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3>Liên Hệ</h3>
              <p>
                <strong>Hotline:</strong><br />
                <a href="tel:0123456789">0123 456 789</a>
              </p>
              <p>
                <strong>Email:</strong><br />
                <a href="mailto:shophoahoanganh@gmail.com">shophoahoanganh@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {currentYear} Shop Hoa Hoàng Anh. Tất cả quyền được bảo lưu.
            </p>
            <div className="footer-links">
              <a href="/dieu-khoan" className="footer-link">Điều khoản</a>
              <a href="/chinh-sach" className="footer-link">Chính sách</a>
              <a href="/sitemap" className="footer-link">Sơ đồ trang</a>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </>
  );
};

export default Layout;