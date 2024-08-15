import React, { useState, useEffect } from 'react';
import './RecipeDetail.css';
import { useNavigate } from 'react-router-dom';
import RecipeModal from './RecipeModal';
import axios from 'axios';
import Appbar from './Appbar';

const RecipeDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recipes from the backend
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/recipe'); // Adjust the API endpoint as needed
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleBack = () => {
    navigate('/RecipeList');
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    navigate('/RecipeList');
  };

  const approvedRecipes = recipes.filter(recipe => recipe.status === 1);

  return (
   
      <div className="appbar-container">
        
        <div className="recipe-container">
     
      
        {approvedRecipes.map((recipe, index) => (
          <div
            className="recipe-card"
            key={index}
            // style={{ marginBottom:'6%',marginTop:'10px',marginLeft:'30px'}}
            onClick={() => handleRecipeClick(recipe)}
          >
            <img
              src={recipe.image || 'fallback-image.png'} // Fallback image if the URL is broken
              alt={recipe.title}
              className="recipe-image"
            />
            <div className="recipe-details">
              <h3>{recipe.title}</h3>
              <p>Description: {recipe.description}</p>
            </div>
          </div>
        ))}
        <div className="button-container">
          <button onClick={handleBack} className="backButton">
            Back
          </button>
        </div>
      </div>

      {isModalOpen && selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default RecipeDetail;
