// src/components/SectionHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, link }) => {
  return (
    <div style={styles.header}>
      <h2 style={styles.title}>{title}</h2>
      <Link to={link} style={styles.viewMoreButton}>Xem thêm →</Link>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    marginTop: '40px'
  },
  title: {
    color: '#e91e63',
    fontSize: '20px',
    margin: 0
  },
  viewMoreButton: {
    backgroundColor: '#fff',
    color: '#e91e63',
    border: '1px solid #e91e63',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    textDecoration: 'none',
    cursor: 'pointer'
  }

};

export default SectionHeader;
