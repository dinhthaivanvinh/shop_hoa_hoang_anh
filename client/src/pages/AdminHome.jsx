import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import AdminPanel from '../components/AdminPanel';

const AdminHome = () => {
  const { isAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate('/admin-login');
  }, [isAdmin]);

  return (
    <>
      {isAdmin && <AdminPanel />}
    </>
  );
};

export default AdminHome;
