import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import "../tokenIndex.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  const coinPrice = [];
  const coinTimestamp = [];

   for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
    coinPrice.push(coinHistory?.data?.history[i].price);
  }

  for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
    coinTimestamp.push(moment.unix(coinHistory?.data?.history[i].timestamp).format('YYYY-MM-DD'));
    }
  const data = {
    labels: coinTimestamp.reverse(),
    datasets: [
      {
        label: 'Price in USD',
        data: coinPrice.reverse(),
        fill: false,
        backgroundColor: 'lime',
        borderColor: 'lime',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <>
      <Line data={data} options={options} style={{ width: "65%", padding: "3%"}}/>
    </>
  );
};
export default LineChart;