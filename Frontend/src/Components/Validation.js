import React, { useState, useEffect, useRef } from 'react';
import './Validation.css';
import { useNavigate } from 'react-router-dom';
import RecipeModal from './RecipeModal';
import axios from 'axios';

const Validation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/recipe');
        const recipes = response.data;
        setRecipes(recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const generateThumbnails = () => {
      recipes.forEach((recipe, index) => {
        const video = document.createElement('video');
        video.src = recipe.video;
        video.crossOrigin = 'anonymous';

        video.addEventListener('loadeddata', () => {
          if (video.readyState >= 2) {
            video.currentTime = 1;
          }
        });

        video.addEventListener('seeked', () => {
          if (video.readyState >= 2) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/png');
            setThumbnails((prevThumbnails) => ({
              ...prevThumbnails,
              [recipe.id]: thumbnail,
            }));
          }
        });

        video.addEventListener('canplaythrough', () => {
          if (video.readyState >= 2) {
            video.currentTime = 1;
          }
        });
      });
    };

    if (recipes.length > 0) {
      generateThumbnails();
    }
  }, [recipes]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video is playing');
            })
            .catch((error) => {
              console.error('Error playing video:', error);
            });
        }
      }
    });
  }, [recipes]);

  const handleBack = () => {
    navigate('/home');
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    navigate('/breakfast');
  };

  const handleApprove = async (recipeId) => {
    try {
      const updatedRecipe = {
        ...recipes.find((recipe) => recipe.id === recipeId),
        status: 1,
      };

      await axios.put(`http://localhost:8080/api/recipe/${recipeId}`, updatedRecipe);
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, status: 1 } : recipe
        )
      );
      setNotification('Recipe approved successfully!');

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 1500);
    } catch (error) {
      console.error('Failed to approve recipe:', error);
      setNotification('Failed to approve recipe');

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
    }
  };

  const handleEdit = (recipe) => {
    navigate('/AddRecipe', { state: { recipe } });
  };

  const sortedRecipes = [...recipes].sort((a, b) => a.status - b.status);

  return (
    <div className="vmain">
      <div className="recipe-container1" style={{ width: '100%' }}>
        {sortedRecipes.map((recipe, index) => (
          <div
            className="recipe-card1"
            key={index}
            onClick={() => handleRecipeClick(recipe)}
          >
            <img src={`${recipe.image}`} className="rimg" alt={recipe.title} />
            <div className="recipe-details">
              <h2>{recipe.title}</h2>
              <h3>Description:</h3>
              <p>{recipe.description}</p>
              <div className="button-container">
                {recipe.status !== 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click from triggering the recipe modal
                      handleApprove(recipe.id);
                    }}
                    id="btnapprove"
                  >
                    Approve
                  </button>
                )}
                <button onClick={() => handleEdit(recipe)} id="btnedit">Edit Recipe</button>
              </div>
            </div>
          </div>
        ))}
        <div className="backButtonContainer2">
          <button onClick={handleBack} className="backButtonv">
            Back
          </button>
        </div>
      </div>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {isModalOpen && selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Validation;
