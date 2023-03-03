import React, { useState } from "react";
import "./App.css";
import { faStar, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [sortBy, setSortBy] = useState("stars");
  const [loading, setLoading] = useState(false);

  async function searchForUser(username) {
    if (!username) {
      alert("Enter a username before clicking on search");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=1000`
      );
      if (response.ok) {
        const repositories = await response.json();
        setRepositories(
          repositories.sort((a, b) => b.stargazers_count - a.stargazers_count)
        );
        setUsername(username);
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Failed to fetch repositories");
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      setLoading(false);
    }
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
    //sorting in the body of the app function will make it run everytime any component on screen is re-rendered, this is better and simple
    if (event.target.value === "stars") {
      repositories.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else {
      repositories.sort((a, b) => b.forks_count - a.forks_count);
    }
  }

  return (
    <div className="App">
      <link
        href="https://fonts.googleapis.com/css?family=Space+Grotesk"
        rel="stylesheet"
      ></link>
      <h1>Github Repository Search</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setRepositories([]);
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
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : null}
      <label>
        Sort by - &nbsp;
        <select value={sortBy} onChange={handleSortChange}>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
        </select>
      </label>
      <ul>
        {/*  can use the repositories state directly here instead of creating a new array */}
        {repositories.map((repository) => {
          return (
            <li key={repository.id}>
              <a href={repository.html_url}>{repository.name}</a>
              <br />
              <FontAwesomeIcon icon={faStar} /> {repository.stargazers_count}{" "}
              stars {"  "}
              <FontAwesomeIcon icon={faCodeBranch} /> {repository.forks_count}{" "}
              forks
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
