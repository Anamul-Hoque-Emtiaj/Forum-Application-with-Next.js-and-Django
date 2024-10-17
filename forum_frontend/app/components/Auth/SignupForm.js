// components/Auth/SignupForm.js
import React from 'react';

const SignupForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Username:</label>
        <input
          type="text"
          name="username"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />  
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">First Name:</label>
        <input
          type="text"
          name="first_name"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />  
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Last Name:</label>
        <input
          type="text"
          name="last_name"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />  
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Password:</label>
        <input
          type="password"
          name="password1"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Confirmed Password:</label>
        <input
          type="password"
          name="password2"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <button
        type="submit"
        className="w-full px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Signup
      </button>
    </form>
  );
};

export default SignupForm;
