// src/components/Header.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import '../style/Header.css';
import logoImage from '../assets/logo.png';

const Header = ({ cartCount = 0 }) => {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Desktop hover state
  const [categoryHoverOpen, setCategoryHoverOpen] = useState(false);
  const [adminHoverOpen, setAdminHoverOpen] = useState(false);

  // Mobile click state
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const categoryRef = useRef();
  const adminRef = useRef();

  // Close all menus when route changes
  useEffect(() => {
    setMenuOpen(false);
    setCategoryHoverOpen(false);
    setAdminHoverOpen(false);
    setMobileCategoryOpen(false);
    setMobileAdminOpen(false);
  }, [location.pathname]);

  // Handle Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setCategoryHoverOpen(false);
        setAdminHoverOpen(false);
        setMobileCategoryOpen(false);
        setMobileAdminOpen(false);
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setMobileCategoryOpen(false);
    setMobileAdminOpen(false);
  };

  return (
    <header className="header">
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
            <img
              src={logoImage}
              alt="Shop Hoa Hoàng Anh Logo"
              className="logo-image"
            />
          </Link>

          {/* Desktop Navigation with Hover */}
          <nav className="header-nav" role="navigation" aria-label="Primary">
            <Link to="/" className="nav-link">
              Trang Chủ
            </Link>

            {/* Desktop Dropdown Danh mục - HOVER */}
            <div
              className={`nav-item has-dropdown ${categoryHoverOpen ? 'open' : ''}`}
              ref={categoryRef}
              onMouseEnter={() => setCategoryHoverOpen(true)}
              onMouseLeave={() => setCategoryHoverOpen(false)}
            >
              <button
                className="nav-link dropdown-toggle"
                aria-expanded={categoryHoverOpen}
              >
                Danh Mục Hoa
                <span className="arrow">▾</span>
              </button>

              <ul className={`dropdown-menu ${categoryHoverOpen ? 'open' : ''}`}>
                <li>
                  <Link to="/category/khai-truong" className="dropdown-link">
                    Hoa Khai Trương
                  </Link>
                </li>
                <li>
                  <Link to="/category/sinh-nhat" className="dropdown-link">
                    Hoa Sinh Nhật
                  </Link>
                </li>
                <li>
                  <Link to="/category/tang-le" className="dropdown-link">
                    Hoa Tang Lễ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Desktop Admin Dropdown - HOVER */}
            {isAdmin && (
              <div
                className={`nav-item has-dropdown ${adminHoverOpen ? 'open' : ''}`}
                ref={adminRef}
                onMouseEnter={() => setAdminHoverOpen(true)}
                onMouseLeave={() => setAdminHoverOpen(false)}
              >
                <button
                  className="nav-link dropdown-toggle"
                  aria-expanded={adminHoverOpen}
                >
                  Quản Trị
                  <span className="arrow">▾</span>
                </button>

                <ul className={`dropdown-menu ${adminHoverOpen ? 'open' : ''}`}>
                  <li>
                    <Link to="/admin/import" className="dropdown-link">
                      Import sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin-orders" className="dropdown-link">
                      Quản lý đơn hàng
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-link" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <Link to="/contact" className="nav-link">
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

      {/* Mobile Sidebar Backdrop */}
      <div
        className={`sidebar-backdrop ${menuOpen ? 'visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Sidebar - CLICK */}
      <aside className={`sidebar-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <img
              src={logoImage}
              alt="Hoàng Anh Logo"
              className="sidebar-logo-image"
            />
          </div>
          <button
            className="close-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Mobile">
          <Link
            to="/"
            className="sidebar-link"
            onClick={handleMobileLinkClick}
          >
            Trang Chủ
          </Link>

          {/* Mobile Danh Mục Dropdown - CLICK */}
          <div className="sidebar-section">
            <button
              className="sidebar-link sidebar-dropdown-toggle"
              onClick={() => setMobileCategoryOpen(prev => !prev)}
              aria-expanded={mobileCategoryOpen}
            >
              Danh Mục Hoa
              <span className={`arrow ${mobileCategoryOpen ? 'open' : ''}`}>▾</span>
            </button>

            {mobileCategoryOpen && (
              <ul className="sidebar-dropdown">
                <li>
                  <Link
                    to="/category/khai-truong"
                    className="sidebar-sublink"
                    onClick={handleMobileLinkClick}
                  >
                    Hoa Khai Trương
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/sinh-nhat"
                    className="sidebar-sublink"
                    onClick={handleMobileLinkClick}
                  >
                    Hoa Sinh Nhật
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/tang-le"
                    className="sidebar-sublink"
                    onClick={handleMobileLinkClick}
                  >
                    Hoa Tang Lễ
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Mobile Admin Dropdown - CLICK */}
          {isAdmin && (
            <div className="sidebar-section">
              <button
                className="sidebar-link sidebar-dropdown-toggle"
                onClick={() => setMobileAdminOpen(prev => !prev)}
                aria-expanded={mobileAdminOpen}
              >
                Quản Trị
                <span className={`arrow ${mobileAdminOpen ? 'open' : ''}`}>▾</span>
              </button>

              {mobileAdminOpen && (
                <ul className="sidebar-dropdown">
                  <li>
                    <Link
                      to="/admin/import"
                      className="sidebar-sublink"
                      onClick={handleMobileLinkClick}
                    >
                      Import sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin-orders"
                      className="sidebar-sublink"
                      onClick={handleMobileLinkClick}
                    >
                      Quản lý đơn hàng
                    </Link>
                  </li>
                  <li>
                    <button
                      className="sidebar-sublink"
                      onClick={() => {
                        handleMobileLinkClick();
                        handleLogout();
                      }}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          <Link
            to="/contact"
            className="sidebar-link"
            onClick={handleMobileLinkClick}
          >
            Liên Hệ
          </Link>
        </nav>
      </aside>
    </header>
  );
};

export default Header;