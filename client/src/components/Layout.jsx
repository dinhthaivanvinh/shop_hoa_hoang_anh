import React from 'react';
import Header from './Header';

const Layout = ({ children, cartCount }) => {
  return (
    <>
      <Header cartCount={cartCount} />
      <main style={styles.main}>
        <div style={styles.container}>
          {children}
        </div>
      </main>


      <footer style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fff0f5', color: '#555' }}>
        © 2025 Hoa Tươi Hoàng Anh. All rights reserved.
      </footer>
    </>
  );
};

const styles = {
  main: {
    padding: '20px 0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    boxSizing: 'border-box'
  }
};


export default Layout;
