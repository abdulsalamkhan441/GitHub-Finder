import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LanguageChart = ({ repos }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const langStats = {};
    repos.forEach((repo) => {
      const lang = repo.language;
      if (lang) langStats[lang] = (langStats[lang] || 0) + 1;
    });

    const labels = Object.keys(langStats);
    const data = Object.values(langStats);

    const chart = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#60a5fa', '#facc15', '#34d399', '#f87171', '#c084fc', '#fbbf24'],
            borderColor: '#1f2937',
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#fff' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [repos]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-2">Language Breakdown</h3>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default LanguageChart;
