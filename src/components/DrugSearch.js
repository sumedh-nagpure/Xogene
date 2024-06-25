import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DrugSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError('');
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`);
      if (response.data.drugGroup.conceptGroup) {
        const concepts = response.data.drugGroup.conceptGroup.reduce((acc, group) => {
          return acc.concat(group.conceptProperties || []);
        }, []);
        setResults(concepts);
      } else {
        const suggestions = await axios.get(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${query}`);
        if (suggestions.data.suggestionGroup.suggestionList) {
          setResults(suggestions.data.suggestionGroup.suggestionList.suggestion || []);
        } else {
          setError('No results found.');
        }
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (name) => {
    navigate(`/drugs/${name}`);
  };

  return (
    <div>
      <h1>Drug Search</h1>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a drug"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      <ul>
        {results.map((result, index) => (
          <li key={index} onClick={() => handleResultClick(result.name || result)}>
            {result.name || result}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DrugSearch;
