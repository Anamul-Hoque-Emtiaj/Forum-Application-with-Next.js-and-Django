// components/DeviceManagement/DeviceList.js
import React from 'react';
import DeviceItem from './DeviceItem';

const DeviceList = ({ devices }) => {
  return (
    <ul className="space-y-2">
      {devices.map((device) => (
        <DeviceItem key={device.id} device={device} />
      ))}
    </ul>
  );
};

export default DeviceList;
