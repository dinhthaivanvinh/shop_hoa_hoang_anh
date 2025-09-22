import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { setIsAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <h3>🛠️ Quản trị hệ thống</h3>
      <ul>
        <li><button onClick={() => navigate('/admin/import')}>📦 Import sản phẩm</button></li>
        <li><button onClick={() => navigate('/admin/orders')}>📋 Quản lý đơn hàng</button></li>
        <li><button onClick={() => navigate('/admin/status')}>🔄 Cập nhật trạng thái đơn</button></li>
      </ul>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>🚪 Đăng xuất</button>
    </div>
  );
};

export default AdminPanel;
