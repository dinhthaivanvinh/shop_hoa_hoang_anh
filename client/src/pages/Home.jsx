import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import axiosClient from '../utils/axiosClient';

const Home = ({ addToCart }) => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/api/products/home')
      .then(res => {
        setProductsByCategory(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (!err.response) {
          console.error('❌ Mất kết nối tới server:', err.message);
        } else {
          console.error('❌ Lỗi khi lấy sản phẩm trang chủ:', err);
        }

        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">⏳ Đang tải sản phẩm...</div>;

  return (
    <div className="bg-white">
      {/* Banner đầu trang */}
      <section className="bg-red-100 py-10 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-2">Đặt hoa online – Giao tận nơi</h2>
        <p className="text-lg text-gray-700">Hoa tươi cho mọi dịp: Khai trương, Sinh nhật, Tang lễ...</p>
      </section>

      {/* Render từng danh mục */}
      {Object.entries(productsByCategory).map(([slug, { label, products }]) => (
        <section key={slug} className="max-w-7xl mx-auto px-4 py-10">
          <SectionHeader title={`🌸 ${label}`} link={`/category/${slug}`} />
          <ProductGrid products={products} addToCart={addToCart} />
        </section>
      ))}
    </div>
  );
};

export default Home;
