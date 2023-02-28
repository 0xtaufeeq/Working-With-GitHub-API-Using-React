import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [sortBy, setSortBy] = useState('stars');

  async function searchForUser(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=1000`);
      if (response.ok) {
        const repositories = await response.json();
        setRepositories(repositories);
        setUsername(username);
      } else {
        throw new Error('Failed to fetch repositories');
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
  }

  let sortedRepositories = repositories;
  if (sortBy === 'stars') {
    sortedRepositories = repositories.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortBy === 'forks') {
    sortedRepositories = repositories.sort((a, b) => b.forks_count - a.forks_count);
  }

  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css?family=Space+Grotesk" rel="stylesheet"></link>
      <h1>Github Repository Search</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          searchForUser(username);
        }}
      >
        <label>
          Enter Github username -
          
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <label>
        Sort by - &nbsp;
        <select value={sortBy} onChange={handleSortChange}>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
        </select>
      </label>
      <ul>
        {sortedRepositories.map((repository) => (
          <li key={repository.id}>
            <a href={repository.html_url}>{repository.name}</a>
            {' - '}
            {repository.stargazers_count} stars, {repository.forks_count} forks
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;