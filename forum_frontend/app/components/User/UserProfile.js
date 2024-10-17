// components/User/UserProfile.js
import React, { useState, useEffect } from 'react';

const UserProfile = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    whatsapp_number: profile.whatsapp_number || '',
    fb_id_link: profile.fb_id_link || '',
    medical_college: profile.medical_college || '',
    session: profile.session || '',
    bmdc_reg_no: profile.bmdc_reg_no || '',
    profile_image: null, // For file upload
  });

  const [previewImage, setPreviewImage] = useState(profile.profile_image || '');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_image') {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        profile_image: file,
      }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage('');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">First Name:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>

      {/* WhatsApp Number */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">WhatsApp Number:</label>
        <input
          type="tel"
          name="whatsapp_number"
          value={formData.whatsapp_number}
          onChange={handleChange}
          pattern="[0-9]{10,15}" // Adjust pattern as needed
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter your WhatsApp number"
        />
      </div>

      {/* Facebook ID Link */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Facebook Profile Link:</label>
        <input
          type="url"
          name="fb_id_link"
          value={formData.fb_id_link}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="https://facebook.com/yourprofile"
        />
      </div>

      {/* Medical College */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Medical College:</label>
        <input
          type="text"
          name="medical_college"
          value={formData.medical_college}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter your medical college"
        />
      </div>

      {/* Session */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Session:</label>
        <input
          type="text"
          name="session"
          value={formData.session}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="e.g., 2023-2024"
        />
      </div>

      {/* BMDC Registration Number */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">BMDC Registration Number:</label>
        <input
          type="text"
          name="bmdc_reg_no"
          value={formData.bmdc_reg_no}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter your BMDC registration number"
        />
      </div>

      {/* Profile Image */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Profile Image:</label>
        <input
          type="file"
          name="profile_image"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Profile Preview"
            className="mt-2 w-32 h-32 object-cover rounded-full"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-3 py-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        Update Profile
      </button>
    </form>
  );
};

export default UserProfile;
