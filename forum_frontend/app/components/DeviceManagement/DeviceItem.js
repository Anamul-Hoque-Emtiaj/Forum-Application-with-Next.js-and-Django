// components/DeviceManagement/DeviceItem.js
import React from 'react';

const DeviceItem = ({ device }) => {
  return (
    <li className="flex justify-between items-center p-4 bg-gray-100 rounded">
      <div>
        <p className="font-medium">{device.ip_address || 'Unnamed Device'}</p>
        <p className="text-sm text-gray-600">{new Date(device.last_login).toLocaleString()}</p>
      </div>
    </li>
  );
};

export default DeviceItem;
