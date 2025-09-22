// src/components/Header.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import "../style/Menu.css"

const Header = ({ cartCount }) => {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [ showDropdown, setShowDropdown ] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo}>
        <h2>🌸 Hoàng Anh</h2>
      </div>

      {/* Menu */}
      <nav style={styles.nav}>
        <Link to="/" className="nav-link">Trang Chủ</Link>
        <Link to="/category/khai-truong" className="nav-link">Hoa Khai Trương</Link>
        <Link to="/category/sinh-nhat" className="nav-link">Hoa Sinh Nhật</Link>
        <Link to="/category/tang-le" className="nav-link">Hoa Đám Tang</Link>
        {isAdmin && (
          <div className="admin-dropdown">
            <Link to="#" onClick={() => setShowDropdown(!showDropdown)} className="nav-link">
              Quản trị
            </Link>

            {showDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/admin/import">📤 Import sản phẩm</Link></li>
                <li><Link to="/admin/orders">📋 Quản lý đơn hàng</Link></li>
                <li><Link to="/admin/status">🔄 Cập nhật trạng thái</Link></li>
                <li><button onClick={handleLogout}>🚪 Đăng xuất</button></li>
              </ul>
            )}
          </div>
        )}
        <a href="#">Liên Hệ</a>
      </nav>

      {/* Hotline & Zalo */}
      <div style={styles.contact}>
        <p>📞 086 223 1477</p>
        <a href="https://zalo.me/0862231477" target="_blank" rel="noopener noreferrer">
          💬 Zalo Chat
        </a>
        <Link to="/cart">
        🛒 Giỏ hàng ({cartCount})
        </Link>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#fff0f5',
    borderBottom: '1px solid #ddd',
    flexWrap: 'wrap',
    position: 'relative'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#e91e63'
  },
  nav: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    position: 'relative'
  },
  dropdown: {
    position: 'relative',
    cursor: 'pointer'
  },
  dropdownToggle: {
    fontWeight: 'bold'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    padding: '8px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  contact: {
    textAlign: 'right',
    fontSize: '14px',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
};

export default Header;
