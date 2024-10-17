// components/Auth/OAuthButton.js
import React from 'react';
// import Image from 'next/image';
// import googleIcon from '../../public/assets/icons/google.svg';

const OAuthButton = ({ onClick, provider }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full px-3 py-2 space-x-2 text-white bg-red-600 rounded hover:bg-red-700"
    >
      {/* <Image src={googleIcon} alt={`${provider} icon`} width={20} height={20} /> */}
      <span>Sign in with {provider}</span>
    </button>
  );
};

export default OAuthButton;
