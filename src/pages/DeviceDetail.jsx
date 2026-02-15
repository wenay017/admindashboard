import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/Devices.css"; 

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    API.get(`/sensor-data`)
      .then((res) => {
        const allData = res.data.data || [];
        const deviceData = allData.filter((item) => item.device_id === deviceId);
        setSensorData(deviceData);
      })
      .catch((error) => {
        console.error("Error fetching device detail:", error);
      });
  }, [deviceId]);

  const tableHeaders = sensorData.length ? Object.keys(sensorData[0]) : [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Device: {deviceId}</h2>

      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header} className="px-4 py-2 border-b">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensorData.map((item, index) => (
              <tr key={index}>
                {tableHeaders.map((col) => (
                  <td key={col} className="px-4 py-2 border-b">
                    {col === "createdAt"
                      ? new Date(item[col]).toLocaleString()
                      : item[col] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceDetail;
