// components/rate-limit.jsx
import { useEffect, useState } from 'react';

export default function RateLimit() {
  const [limit, setLimit] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/rate_limit')
      .then(res => res.json())
      .then(data => {
        setLimit(data.rate);
      });
  }, []);

  if (!limit) return null;

  return (
    <div className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
      ⏱ GitHub API Requests: {limit.remaining} / {limit.limit}
    </div>
  );
}
