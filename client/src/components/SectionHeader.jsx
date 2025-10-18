// src/components/SectionHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/SectionHeader.css'; // ✅ import CSS thuần

const SectionHeader = ({ title, link }) => {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      <Link to={link} className="view-more-button">Xem thêm →</Link>
    </div>
  );
};

export default SectionHeader;
