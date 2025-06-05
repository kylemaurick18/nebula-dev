import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-logo">
      <svg width="59" height="51" viewBox="0 0 59 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M36.6052 49.2658L27.6629 40.3235V50.7986C25.9746 50.7019 24.3423 50.3962 22.7914 49.9069V40.3234L16.5125 46.6023C15.2279 45.6001 14.0685 44.4447 13.062 43.1635L19.3467 36.8788H9.73048C9.23701 35.3284 8.92713 33.696 8.82642 32.0074H19.3468L10.3564 23.017C11.0162 21.4523 11.8691 19.9888 12.8852 18.6565L22.7914 28.5627V11.6846C24.3423 11.1953 25.9746 10.8896 27.6629 10.793V28.5627L41.1942 15.0314C42.4753 16.0379 43.6307 17.1972 44.633 18.4819L31.1074 32.0074H48.8264C48.7257 33.6961 48.4158 35.3284 47.9223 36.8788H31.1075L40.9657 46.737C39.6334 47.7531 38.17 48.606 36.6052 49.2658ZM32.2123 34.4431C28.4051 34.1534 25.3795 31.1278 25.0898 27.3206C24.8001 31.1278 21.7745 34.1534 17.9673 34.4431C21.7745 34.7328 24.8001 37.7584 25.0898 41.5656C25.3795 37.7584 28.4051 34.7328 32.2123 34.4431Z" fill="white"/>
        <g opacity="0.7" filter="url(#filter0_f_2301_32)">
        <path d="M42.4173 16.8444L25.6997 34.159M25.6997 34.159V10.9932M25.6997 34.159L11.0121 20.0684M25.6997 34.159H47.9102" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <filter id="filter0_f_2301_32" x="0.512085" y="0.493164" width="57.8981" height="44.166" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_2301_32"/>
        </filter>
        </defs>
      </svg>
      </div>
    </div>
  );
} 