const Trending = () => {
  const devs = [
    { name: 'SkipTheDishes', link: 'https://www.skipthedishes.com/' },
    { name: 'Bold Commerce', link: 'https://boldcommerce.com/' },
    { name: 'Payworks', link: 'https://www.payworks.ca/' },
  ];

  return (
    <div className="mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Trending in Winnipeg</h2>
      <ul className="list-disc list-inside">
        {devs.map((dev) => (
          <li key={dev.name}>
            <a href={dev.link} target="_blank" className="text-blue-500 hover:underline">
              {dev.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trending;
