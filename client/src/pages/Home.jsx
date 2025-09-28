import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import axiosClient from '../utils/axiosClient';

const Home = ({addToCart}) => {
  const [productsByCategory, setProductsByCategory] = useState({
    KhaiTruong: [],
    SinhNhat: [],
    TangLe: []
  });

  useEffect(() => {
    axiosClient.get('/api/products/home')
      .then(res => {
        setProductsByCategory(res.data);
      })
      .catch(err => {
        console.error('❌ Lỗi khi lấy sản phẩm trang chủ:', err);
      });
  }, []);

  return (
    <>
      <SectionHeader title="🌼 Hoa Khai Trương" link="/category/khai-truong" />
      <ProductGrid products={productsByCategory.KhaiTruong} addToCart={addToCart} />

      <SectionHeader title="🎂 Hoa Sinh Nhật" link="/category/sinh-nhat" />
      <ProductGrid products={productsByCategory.SinhNhat} addToCart={addToCart} />

      <SectionHeader title="🕊️ Hoa Tang Lễ" link="/category/tang-le" />
      <ProductGrid products={productsByCategory.TangLe} addToCart={addToCart} />
    </>
  );
};

export default Home;
