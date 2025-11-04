import React from 'react';

type Props = {
  className?: string;
};

const SearchIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8335 15.8333L12.2085 12.2083M14.1668 7.5C14.1668 11.1819 11.1821 14.1667 7.50016 14.1667C3.81826 14.1667 0.833496 11.1819 0.833496 7.5C0.833496 3.8181 3.81826 0.833336 7.50016 0.833336C11.1821 0.833336 14.1668 3.8181 14.1668 7.5Z"
        stroke="#667085"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
