import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" stroke="#2F2F2F" strokeWidth="4"/>
          <path d="M20 2C29.3888 2 37 9.61116 37 19" stroke="#2DD4AD" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
} 