const Pagination = ({ onLoadMore }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onLoadMore}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Load More Repos
      </button>
    </div>
  );
};

export default Pagination;