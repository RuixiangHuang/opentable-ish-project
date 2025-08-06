import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import config from '../../config';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [reservationData, setReservationData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESERVATION_NUMBER(2025, 5)}`);
        const json = await res.json();
        if (json.code === 200) {
          const dates = json.data.map(item => item.date);
          const reservationsCount = json.data.map(item => item.count);
          setReservationData({ dates, reservationsCount });
        } else {
          setError(json.msg || 'Failed to load data.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      }
    };

    fetchReservationData();
  }, []);

  if (error) {
    return <div className="error-msg">{error}</div>;
  }

  if (!reservationData) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: reservationData.dates,
    datasets: [
      {
        label: 'Reservations',
        data: reservationData.reservationsCount,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Reservations Analytics - May 2025</h2>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
