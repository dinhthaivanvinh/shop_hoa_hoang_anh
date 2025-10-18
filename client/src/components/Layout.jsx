// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import '../style/Layout.css'; // ✅ import file CSS thuần

const Layout = ({ children, cartCount }) => {
  return (
    <>
      <Header cartCount={cartCount} />
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        © 2025 Hoa Tươi Hoàng Anh. All rights reserved.
      </footer>
    </>
  );
};

export default Layout;
