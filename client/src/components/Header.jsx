// src/components/Header.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import '../style/Header.css';

const Header = ({ cartCount = 0 }) => {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const categoryRef = useRef();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSubmenuOpen(false);
    setCategoryMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSubmenuOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSubmenuOpen(false);
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="header-top-container">
          <div className="header-top-left">
            <span className="top-info">
              <span className="icon">📧</span>
              <a href="mailto:shophoahoanganh@gmail.com">shophoahoanganh@gmail.com</a>
            </span>
          </div>
          <div className="header-top-right">
            <span className="top-info">
              <span className="icon">📞</span>
              <a href="tel:0123456789">Hotline: 0123 456 789</a>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            className="hamburger"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🌸</span>
            <span className="logo-text">
              <span className="logo-main">Shop Hoa Hoàng Anh</span>
              <span className="logo-sub">Tươi đẹp mỗi ngày</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav" role="navigation" aria-label="Primary">
            <Link to="/" className="nav-link">
              <span className="icon">🏠</span>
              Trang Chủ
            </Link>

            {/* Dropdown Danh mục */}
            <div
              className={`nav-item has-dropdown ${categoryMenuOpen ? 'open' : ''}`}
              ref={categoryRef}
            >
              <button
                className="nav-link dropdown-toggle"
                aria-expanded={categoryMenuOpen}
                onClick={() => setCategoryMenuOpen(prev => !prev)}
              >
                <span className="icon">🌺</span>
                Danh Mục Hoa
                <span className="arrow">▾</span>
              </button>

              <ul className={`dropdown-menu ${categoryMenuOpen ? 'open' : ''}`}>
                <li>
                  <Link to="/category/khai-truong" className="dropdown-link">
                    🎉 Hoa Khai Trương
                  </Link>
                </li>
                <li>
                  <Link to="/category/sinh-nhat" className="dropdown-link">
                    🎂 Hoa Sinh Nhật
                  </Link>
                </li>
                <li>
                  <Link to="/category/tang-le" className="dropdown-link">
                    🕯️ Hoa Tang Lễ
                  </Link>
                </li>
              </ul>
            </div>

            {isAdmin && (
              <div
                className={`nav-item has-dropdown ${submenuOpen ? 'open' : ''}`}
                ref={dropdownRef}
              >
                <button
                  className="nav-link dropdown-toggle"
                  aria-expanded={submenuOpen}
                  onClick={() => setSubmenuOpen(prev => !prev)}
                >
                  <span className="icon">⚙️</span>
                  Quản Trị
                  <span className="arrow">▾</span>
                </button>

                <ul className={`dropdown-menu ${submenuOpen ? 'open' : ''}`}>
                  <li>
                    <Link to="/admin/import" className="dropdown-link">
                      📤 Import sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin-orders" className="dropdown-link">
                      📋 Quản lý đơn hàng
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-link" onClick={handleLogout}>
                      🚪 Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <Link to="/contact" className="nav-link">
              <span className="icon">📞</span>
              Liên Hệ
            </Link>
          </nav>

          {/* Cart */}
          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Giỏ hàng</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sidebar-backdrop ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />

      <aside className={`sidebar-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="sidebar-header">
          <span className="sidebar-logo">🌸 Hoàng Anh</span>
          <button className="close-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Mobile">
          <Link to="/" className="sidebar-link" onClick={() => setMenuOpen(false)}>
            🏠 Trang Chủ
          </Link>

          <div className="sidebar-section">
            <button
              className="sidebar-link sidebar-dropdown-toggle"
              onClick={() => setCategoryMenuOpen(prev => !prev)}
            >
              🌺 Danh Mục Hoa
              <span className={`arrow ${categoryMenuOpen ? 'open' : ''}`}>▾</span>
            </button>
            {categoryMenuOpen && (
              <ul className="sidebar-dropdown">
                <li>
                  <Link to="/category/khai-truong" className="sidebar-sublink" onClick={() => setMenuOpen(false)}>
                    🎉 Hoa Khai Trương
                  </Link>
                </li>
                <li>
                  <Link to="/category/sinh-nhat" className="sidebar-sublink" onClick={() => setMenuOpen(false)}>
                    🎂 Hoa Sinh Nhật
                  </Link>
                </li>
                <li>
                  <Link to="/category/tang-le" className="sidebar-sublink" onClick={() => setMenuOpen(false)}>
                    🕯️ Hoa Tang Lễ
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {isAdmin && (
            <div className="sidebar-section">
              <button
                className="sidebar-link sidebar-dropdown-toggle"
                onClick={() => setSubmenuOpen(prev => !prev)}
              >
                ⚙️ Quản Trị
                <span className={`arrow ${submenuOpen ? 'open' : ''}`}>▾</span>
              </button>
              {submenuOpen && (
                <ul className="sidebar-dropdown">
                  <li>
                    <Link to="/admin/import" className="sidebar-sublink" onClick={() => setMenuOpen(false)}>
                      📤 Import sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin-orders" className="sidebar-sublink" onClick={() => setMenuOpen(false)}>
                      📋 Quản lý đơn hàng
                    </Link>
                  </li>
                  <li>
                    <button className="sidebar-sublink" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                      🚪 Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          <Link to="/contact" className="sidebar-link" onClick={() => setMenuOpen(false)}>
            📞 Liên Hệ
          </Link>
        </nav>
      </aside>
    </header>
  );
};

export default Header;