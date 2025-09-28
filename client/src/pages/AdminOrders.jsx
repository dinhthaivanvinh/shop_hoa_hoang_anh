import React, { useContext, useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import '../style/AdminOrders.css' // nhớ tạo file CSS này
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
    }
  }, [isAdmin]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get(`/api/orders?page=${page}&status=${statusFilter}`);
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
      }
    };

    fetchOrders();
  }, [page, statusFilter]);

  const handleViewDetail = async (orderId) => {
    try {
      const res = await axiosClient.get(`/api/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
    }
  };

  const formatDate = (date) => {
    const createdAt = new Date(date);
    return createdAt.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);
  }

  return (
    <div className="admin-orders">
      <h2>📋 Danh sách đơn hàng</h2>

      <div className="filter-bar">
        <label>Lọc theo trạng thái:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="pending">Đang xử lý</option>
          <option value="shipped">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatPrice(order.totalPrice)}</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="pending">Đang xử lý</option>
                  <option value="shipped">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleViewDetail(order.id)}>Xem</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Trước</button>
        <span>Trang {page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sau →</button>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
            <p>Khách hàng: {selectedOrder.customerName}</p>
            <p>Ngày đặt: {formatDate(selectedOrder.createdAt)}</p>
            <p>Tổng tiền: {formatPrice(selectedOrder.totalPrice)}</p>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="order-total-quantity">
              Tổng số sản phẩm: {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <button onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
