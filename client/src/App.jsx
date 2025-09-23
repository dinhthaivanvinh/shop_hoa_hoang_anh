// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Layout from './components/Layout';
import CategoryPage from './pages/CategoryPage';
import OrderPage from './components/OrderPage';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import { AdminProvider } from './context/AdminContext';
import CsvUploader from './components/CsvUploader';
import AdminOrders from './pages/AdminOrders';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    toast.success('✅ Đã thêm vào giỏ!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info('🗑️ Đã xóa khỏi giỏ hàng', {autoClose: 1000});
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('🧹 Đã xóa toàn bộ giỏ hàng!', {autoClose: 1000});
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  return (
    <AdminProvider>

      <Router>
        <Layout cartCount={cartItems.length}>
          <Routes>
            <Route path="/order" element={<OrderPage cartItems={cartItems} clearCart={clearCart}/>} />
            
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />} />
            <Route path="/category/:categorySlug" element={<CategoryPage addToCart={addToCart} />} />
            <Route path="/admin/import" element={<CsvUploader />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-orders" element={<AdminOrders />} />
            <Route path="/admin" element={<AdminHome />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </Router>
    </AdminProvider>
  );
}

export default App;
