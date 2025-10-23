// src/components/SectionHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/SectionHeader.css'; // ✅ import CSS thuần

const SectionHeader = ({ title, link }) => {
  return (
    <div className="section-header">
      <h2 className="section-title">
        <b aria-hidden="true"></b>
        TOP MẪU HOA {title} MỚI NHẤT
        <b aria-hidden="true"></b>
      </h2>
    </div>
  );
};

export default SectionHeader;
