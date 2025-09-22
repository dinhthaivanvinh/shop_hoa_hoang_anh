// src/data/products.js
import { Category } from "./category";

const tangLeProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Hoa Tang lễ số ${i + 1}`,
  price: 200000 + i * 50000,
  image: `https://via.placeholder.com/300x300?text=Tang+Le+${i + 1}`,
  description: `Mô tả ngắn gọn cho hoa Tang lễ số ${i + 1}.`,
  category: Category.TangLe
}));

const sinhNhatProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 21,
  name: `Hoa Sinh nhật số ${i + 1}`,
  price: 200000 + i * 50000,
  image: `https://via.placeholder.com/300x300?text=Sinh+Nhat+${i + 1}`,
  description: `Mô tả ngắn gọn cho hoa Sinh nhật số ${i + 1}.`,
  category: Category.SinhNhat
}));

const khaiTruongProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 41,
  name: `Hoa Khai trương số ${i + 1}`,
  price: 200000 + i * 50000,
  image: `https://via.placeholder.com/300x300?text=Khai+Truong+${i + 1}`,
  description: `Mô tả ngắn gọn cho hoa Khai trương số ${i + 1}.`,
  category: Category.KhaiTruong
}));

const products = [...tangLeProducts, ...sinhNhatProducts, ...khaiTruongProducts];

export default products;
