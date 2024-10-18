// components/DeviceManagement/DeviceItem.js
import React from 'react';

const DeviceItem = ({ device }) => {
  return (
    <li className="flex justify-between items-center p-4 bg-gray-100 rounded">
      <div>
        <p className="font-medium text-black">IP: {device.ip_address || 'Unnamed Device'}</p>
        <p className="text-sm text-gray-600">Last Login: {new Date(device.last_login).toLocaleString()}</p>
        <p className="text-sm text-gray-600">Status: {device.is_active ? 'Active' : 'Inactive'}</p>
      </div>
    </li>
  );
};

export default DeviceItem;
