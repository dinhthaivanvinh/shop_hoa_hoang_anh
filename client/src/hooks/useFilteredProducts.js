// hooks/useFilteredProducts.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFilteredProducts = ({ page = 1, categorySlug = null, filters }) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          searchText: filters.searchText || '',
          minPrice: filters.minPrice || '',
          maxPrice: filters.maxPrice || ''
        };

        let url = '';
        if (categorySlug) {
          url = `/api/products/category?type=${categorySlug}`;
        } else {
          url = `/api/products/home`;
        }

        const response = await axios.get(url, { params });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('🔥 Lỗi gọi API sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, categorySlug, filters]);

  return { products, totalPages, loading };
};

export default useFilteredProducts;
