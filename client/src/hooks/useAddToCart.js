// src/hooks/useAddToCart.js
import { useState, useCallback } from 'react';

const ADD_TO_CART_SUCCESS_DELAY = 1000;

/**
 * Custom hook for managing add to cart functionality
 * @param {Function} addToCart - Function to add item to cart
 * @returns {Object} - { isAdding, handleAddToCart }
 */
export const useAddToCart = (addToCart) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback(async (product, event) => {
    // Prevent default link behavior if event is provided
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Prevent multiple clicks
    if (isAdding) return;

    setIsAdding(true);

    try {
      await addToCart(product);
      
      // Show success state briefly
      setTimeout(() => {
        setIsAdding(false);
      }, ADD_TO_CART_SUCCESS_DELAY);

      return { success: true };
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ hàng:', error);
      setIsAdding(false);
      
      return { success: false, error };
    }
  }, [isAdding, addToCart]);

  return {
    isAdding,
    handleAddToCart
  };
};

export default useAddToCart;