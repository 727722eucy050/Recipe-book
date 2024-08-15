import React, { useState } from 'react';
import './Appbar.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
function Appbar({ onSearch, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      // If the search query is cleared, navigate to the home page
      navigate('/RecipeDetail');
    } else {
      // Otherwise, perform the search and navigate to the search page
      onSearch(value);
      navigate('/search');
    }
  };

  return (
    <div className="app-bar">
    <img src={logo} alt="Kitchen Chronicles Logo" className="logo" />
      <div className="nav">
        <h2>SAVORY STORIES</h2>
        The Recipe Book
      </div>
      <div className="search">
        <input 
          type="text" 
          placeholder="Find a recipe..." 
          value={inputValue}
        onChange={handleInputChange}
        />
        <button type="submit" className='btn'>Q</button>
      </div>
      <div className="auth">
        To upload your recipes and explore a world of flavors!
        <a href="/Login">Login</a>
      </div>
    </div>
  );
}

export default Appbar;