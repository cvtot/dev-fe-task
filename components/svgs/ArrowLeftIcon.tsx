import React from 'react';
interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}
const ArrowLeftIcon: React.FC<IconProps> = ({
  className = '',
  width = 24,
  height = 24,
  color = 'currentColor',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={width}
    height={height}
    className={className}
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default ArrowLeftIcon;
