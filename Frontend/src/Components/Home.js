// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const handleView = () => {
    navigate('/RecipeList');
  };
  
  const handleAddRecipe = () => {
    navigate('/Addrecipe');
  };

  return (
    <div className="home-container" style={{paddingBottom: '15px'}}>
      <h1>The Savory Stories</h1>
      <div className='image'><img src="https://extension.usu.edu/images/meal-prep.jpg" ></img></div>
      <p>A place that holds knowledge of food, so we could understand what goes into our body as part of understanding ourself.</p>
      <p>Unleash your culinary prowess and click below for futher more!</p>
      <div className="button-containers">
        <button onClick={handleView} className='buttonhm'>View Recipes</button>
        <button onClick={handleAddRecipe} className='buttonhm'>Add Recipe</button>
      </div>
    </div>
  );
};

export default Home;
