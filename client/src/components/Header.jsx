// src/components/Header.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import '../style/Header.css';
import logoImage from '../assets/logo.png';
import shoppingCartIcon from '../assets/icon/shopping_cart_icon.svg';

const Header = ({ cartCount = 0 }) => {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Desktop hover state
  const [categoryHoverOpen, setCategoryHoverOpen] = useState(false);
  const [colorHoverOpen, setColorHoverOpen] = useState(false);
  const [styleHoverOpen, setStyleHoverOpen] = useState(false);
  const [adminHoverOpen, setAdminHoverOpen] = useState(false);

  // Mobile click state
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileColorOpen, setMobileColorOpen] = useState(false);
  const [mobileStyleOpen, setMobileStyleOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const categoryRef = useRef();
  const colorRef = useRef();
  const styleRef = useRef();
  const adminRef = useRef();

  // Danh sách màu sắc
  const colors = [
    { id: 1, name: 'Cam', slug: 'cam' },
    { id: 2, name: 'Đen', slug: 'den' },
    { id: 3, name: 'Đỏ', slug: 'do' },
    { id: 4, name: 'Hồng', slug: 'hong' },
    { id: 5, name: 'Kem', slug: 'kem' },
    { id: 6, name: 'Tím', slug: 'tim' },
    { id: 7, name: 'Trắng', slug: 'trang' },
    { id: 8, name: 'Vàng', slug: 'vang' },
    { id: 9, name: 'Xanh Lá', slug: 'xanh-la' }
  ];

  // Danh sách kiểu dáng
  const styles = [
    { id: 1, name: 'Bình', slug: 'binh' },
    { id: 2, name: 'Bó', slug: 'bo' },
    { id: 3, name: 'Giỏ', slug: 'gio' },
    { id: 4, name: 'Hoa Cưới', slug: 'hoa-cuoi' },
    { id: 5, name: 'Hoa Để Bàn', slug: 'hoa-de-ban' },
    { id: 6, name: 'Hộp Hoa', slug: 'hop-hoa' },
    { id: 7, name: 'Kệ', slug: 'ke' },
    { id: 8, name: 'Lẵng', slug: 'lang' }
  ];

  // Close all menus when route changes
  useEffect(() => {
    setMenuOpen(false);
    setCategoryHoverOpen(false);
    setColorHoverOpen(false);
    setAdminHoverOpen(false);
    setMobileCategoryOpen(false);
    setMobileColorOpen(false);
    setMobileStyleOpen(false)
    setMobileAdminOpen(false);
  }, [location.pathname]);

  // Handle Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setCategoryHoverOpen(false);
        setColorHoverOpen(false);
        setAdminHoverOpen(false);
        setMobileCategoryOpen(false);
        setMobileColorOpen(false);
        setMobileStyleOpen(false)
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
    setMobileColorOpen(false);
    setMobileStyleOpen(false)
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

            {/* Desktop Dropdown Màu Sắc - HOVER */}
            <div
              className={`nav-item has-dropdown ${colorHoverOpen ? 'open' : ''}`}
              ref={colorRef}
              onMouseEnter={() => setColorHoverOpen(true)}
              onMouseLeave={() => setColorHoverOpen(false)}
            >
              <button
                className="nav-link dropdown-toggle"
                aria-expanded={colorHoverOpen}
              >
                Màu Sắc
                <span className="arrow">▾</span>
              </button>

              <ul className={`dropdown-menu ${colorHoverOpen ? 'open' : ''}`}>
                {colors.map(color => (
                  <li key={color.id}>
                    <Link to={`/color/${color.slug}`} className="dropdown-link">
                      {color.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Dropdown Kiểu Dáng - HOVER */}
            <div
              className={`nav-item has-dropdown ${styleHoverOpen ? 'open' : ''}`}
              ref={styleRef}
              onMouseEnter={() => setStyleHoverOpen(true)}
              onMouseLeave={() => setStyleHoverOpen(false)}
            >
              <button
                className="nav-link dropdown-toggle"
                aria-expanded={styleHoverOpen}
              >
                Kiểu Dáng
                <span className="arrow">▾</span>
              </button>

              <ul className={`dropdown-menu ${styleHoverOpen ? 'open' : ''}`}>
                {styles.map(style => (
                  <li key={style.id}>
                    <Link to={`/style/${style.slug}`} className="dropdown-link">
                      {style.name}
                    </Link>
                  </li>
                ))}
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
            <img className='cart-btn-icon' src={shoppingCartIcon} alt="" />
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

          {/* Mobile Màu Sắc Dropdown - CLICK */}
          <div className="sidebar-section">
            <button
              className="sidebar-link sidebar-dropdown-toggle"
              onClick={() => setMobileColorOpen(prev => !prev)}
              aria-expanded={mobileColorOpen}
            >
              Màu Sắc
              <span className={`arrow ${mobileColorOpen ? 'open' : ''}`}>▾</span>
            </button>

            {mobileColorOpen && (
              <ul className="sidebar-dropdown">
                {colors.map(color => (
                  <li key={color.id}>
                    <Link
                      to={`/color/${color.slug}`}
                      className="sidebar-sublink"
                      onClick={handleMobileLinkClick}
                    >
                      {color.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Kiểu Dáng Dropdown - CLICK */}
          <div className="sidebar-section">
            <button
              className="sidebar-link sidebar-dropdown-toggle"
              onClick={() => setMobileStyleOpen(prev => !prev)}
              aria-expanded={mobileStyleOpen}
            >
              Kiểu Dáng
              <span className={`arrow ${mobileStyleOpen ? 'open' : ''}`}>▾</span>
            </button>

            {mobileStyleOpen && (
              <ul className="sidebar-dropdown">
                {styles.map(stle => (
                  <li key={stle.id}>
                    <Link
                      to={`/style/${stle.slug}`}
                      className="sidebar-sublink"
                      onClick={handleMobileLinkClick}
                    >
                      {stle.name}
                    </Link>
                  </li>
                ))}
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