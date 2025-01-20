import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

const Charts = ({ users, components }) => {
  const pieData = {
    labels: ['Users', 'Components'],
    datasets: [
      {
        data: [users.length, components.length],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  const barData = {
    labels: ['Users', 'Components'],
    datasets: [
      {
        data: [users.length, components.length],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      <div>
        <Pie data={pieData} />
      </div>
      <div>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default Charts;
