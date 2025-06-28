import { useState, useEffect } from 'react';
import SkeletonLoader from './components/skeleton-loader';
import Pagination from './components/pagination-component';
import Trending from './components/trending';
import RateLimit from './components/rate-limit';
import DarkModeToggle from './components/darkmode-toggle';
import RecentSearches from './components/recent-searches';

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
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecent(stored);
  }, []);

  const updateRecent = (username) => {
    let updated = [username, ...recent.filter((u) => u !== username)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://api.github.com/users/${search}`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setUser(data);
      const repoRes = await fetch(
        `https://api.github.com/users/${search}/repos?per_page=100&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json',
          },
        }
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
    updateRecent(search);
    fetchUser();
  };

  let filteredRepos = repos
    .filter((repo) => (language ? repo.language === language : true))
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
    <div className="max-w-4xl mx-auto p-4 animate-fade-in text-gray-800 dark:text-white">
      <DarkModeToggle />

      <header className="text-center mb-8">
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <h1 className="text-4xl font-bold mb-2 tracking-tight animate-fade-in-up">
            🔍 GitHub Profile Finder
          </h1>
          <p className="text-md text-indigo-100 animate-fade-in-up delay-75">
            Discover GitHub users and explore their open-source work like a pro.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-6 items-center justify-center animate-fade-in-up"
      >
        <input
          type="text"
          placeholder="Search GitHub user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 p-3 rounded-full border border-indigo-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 transition"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow transition">
          Search
        </button>
      </form>

      {recent.length > 0 && (
        <RecentSearches list={recent} onSelect={(u) => { setSearch(u); fetchUser(); }} />
      )}

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

          <RateLimit />

          <div className="space-y-4">
            {filteredRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{repo.name}</h3>
                <p>{repo.description}</p>
                {repo.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {repo.topics.map((topic) => (
                      <span key={topic} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded dark:bg-indigo-900 dark:text-indigo-200">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm mt-2 flex gap-4">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span>{repo.language}</span>
                </div>
              </a>
            ))}
          </div>

          {filteredRepos.length >= 100 && (
            <Pagination onLoadMore={() => setPage((prev) => prev + 1)} />
          )}
        </>
      )}

      <Trending />
    </div>
  );
};

export default App;
