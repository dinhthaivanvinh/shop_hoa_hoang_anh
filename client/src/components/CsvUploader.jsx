import React, { useState } from 'react';
import axios from 'axios';

const CsvUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('⚠️ Vui lòng chọn file CSV!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus(`✅ Import thành công: ${res.data.count} sản phẩm`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Lỗi khi import sản phẩm');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📤 Import sản phẩm từ CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button style={styles.button} onClick={handleUpload}>Tải lên & Import</button>
      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fff'
  },
  title: {
    marginBottom: '20px',
    color: '#e91e63'
  },
  button: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#e91e63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  status: {
    marginTop: '16px',
    fontWeight: 'bold'
  }
};

export default CsvUploader;
