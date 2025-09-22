import React from 'react';

const Base64Image = ({
  base64,
  alt = 'Ảnh sản phẩm',
  type = 'jpeg',
  style = {},
  className = ''
}) => {
  if (!base64) return <div style={{ color: '#999' }}>Không có ảnh</div>;

  const src = `data:image/${type};base64,${base64}`;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
    />
  );
};

export default Base64Image;
