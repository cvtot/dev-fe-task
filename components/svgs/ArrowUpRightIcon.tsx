import React from 'react';

type Props = {
  className?: string;
};

const ArrowUpRightIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 11L11 1M11 1H1M11 1V11"
        stroke="#101828"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowUpRightIcon;
