import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [sortBy, setSortBy] = useState('stars');
  const [error, setError] = useState('');

  async function searchForUser(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=1000`);
      if (response.ok) {
        const repositories = await response.json();
        setRepositories(repositories);
        setUsername(username);
        setError('');
      } else {
        throw new Error('Failed to fetch repositories');
      }
    } catch (error) {
      console.error(error);
      setRepositories([]);
      setUsername('');
      setError('Could not find user or fetch repositories');
    }
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
  }

  let sortedRepositories = repositories;
  if (sortBy === 'stars') {
    sortedRepositories = repositories.slice().sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortBy === 'forks') {
    sortedRepositories = repositories.slice().sort((a, b) => b.forks_count - a.forks_count);
  }

  return (
    <div className="App">
      <img src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' alt='github logo' width='100px' height='100px'></img>
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
      
      {error && <p>{error}</p>}
      
      <ul>
        {sortedRepositories.map((repository) => (
          <li key={repository.id}>
            <a href={repository.html_url}>{repository.name}</a>
            <br />
            <span className="icon">
              <i className="fas fa-star"></i> {repository.stargazers_count} stars,{' '}
            </span>
            <span className="icon">
              <i className="fas fa-code-branch"></i> {repository.forks_count} forks
            </span>
            <p>{repository.owner.login}</p>
            <p>{repository.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
