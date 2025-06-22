import { useState, useEffect } from 'react';
import SkeletonLoader from './skeleton-loader';
import Pagination from './pagination-component';
import LanguageChart from './chart-component';
import Trending from './trending';

const App = () => {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('');
  const [language, setLanguage] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://api.github.com/users/${search}`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setUser(data);
      const repoRes = await fetch(
        `https://api.github.com/users/${search}/repos?per_page=100&page=${page}`
      );
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err) {
      setError(err.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) fetchUser();
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUser();
  };

  let filteredRepos = repos
    .filter((repo) =>
      language ? repo.language === language : true
    )
    .filter((repo) =>
      keyword ? repo.name.toLowerCase().includes(keyword.toLowerCase()) : true
    );

  if (sortType === 'stars') {
    filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortType === 'forks') {
    filteredRepos.sort((a, b) => b.forks_count - a.forks_count);
  } else if (sortType === 'updated') {
    filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search GitHub user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700"
        />
        <button className="bg-indigo-600 text-white px-4 rounded">Search</button>
      </form>

      {loading && (
        <div className="space-y-4">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {user && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-4">
          <div className="flex items-center gap-4">
            <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p>{user.bio}</p>
              <p>
                <strong>{user.followers}</strong> Followers ·{' '}
                <strong>{user.following}</strong> Following
              </p>
              <p>
                <strong>{user.public_repos}</strong> Public Repos
              </p>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <select onChange={(e) => setSortType(e.target.value)} className="p-2 rounded">
              <option value="">Sort By</option>
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="updated">Recently Updated</option>
            </select>
            <select onChange={(e) => setLanguage(e.target.value)} className="p-2 rounded">
              <option value="">Filter by Language</option>
              {[...new Set(repos.map((r) => r.language).filter(Boolean))].map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search repo keywords..."
              className="p-2 rounded"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                className="block bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{repo.name}</h3>
                <p>{repo.description}</p>
                <div className="text-sm mt-2 flex gap-4">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span>{repo.language}</span>
                </div>
              </a>
            ))}
          </div>

          {filteredRepos.length >= 100 && <Pagination onLoadMore={() => setPage((prev) => prev + 1)} />}

          <div className="mt-8">
            <LanguageChart repos={repos} />
          </div>
        </>
      )}

      <Trending />
    </div>
  );
};

export default App;