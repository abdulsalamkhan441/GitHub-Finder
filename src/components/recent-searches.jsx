// components/recent-searches.jsx
export default function RecentSearches({ list, onSelect }) {
  return (
    <div className="mb-4 flex gap-2 flex-wrap text-sm text-gray-600 dark:text-gray-300">
      {list.map((user, idx) => (
        <button
          key={idx}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-600 transition"
          onClick={() => onSelect(user)}
        >
          {user}
        </button>
      ))}
    </div>
  );
}
