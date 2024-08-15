import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddRecipe.css';
import axios from 'axios';

function AddRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null); // Reference to the video element

  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: '',
    instruction: '',
    image: '',
  });
  const [recipeId, setRecipeId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.recipe) {
      const { id, title, description, ingredients, instruction, image } = location.state.recipe;
      setRecipeId(id);
      setRecipe({
        title,
        description,
        ingredients,
        instruction,
        image,
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (isSubmitted) {
      setSuccessMessage('Recipe submitted successfully!');
      setTimeout(() => {
        navigate('/Home');
      }, 2000); // Wait for 2 seconds before navigating
    }
  }, [isSubmitted, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (recipeId) {
        const response = await axios.put(`http://localhost:8080/api/recipe/${recipeId}`, recipe);
        if (response.status === 200) {
          setIsSubmitted(true);
        } else {
          setErrors({ apiError: 'Server error occurred' });
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/recipe', recipe);
        if (response.status === 200 || response.status === 201) {
          setIsSubmitted(true);
        } else {
          setErrors({ apiError: 'Server error occurred' });
        }
      }
    } catch (error) {
      if (error.response) {
        setErrors({ apiError: error.response.data.message || 'An error occurred while submitting the recipe.' });
      } else if (error.request) {
        setErrors({ apiError: 'No response received from the server.' });
      } else {
        setErrors({ apiError: 'An error occurred while setting up the request.' });
      }
    }
  };

  const handleBack = () => {
    navigate('/Home');
  };

  // Handle video playback control
  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= 28) {
        videoElement.currentTime = 0; // Restart the video
        videoElement.play(); // Play the video again
      }
    };

    const handleCanPlayThrough = () => {
      videoElement.play();
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, []);

  return (
    <div className="add-recipe-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="background-video"
        preload="auto" // Preload the video for immediate playback
      >
        <source src="/video/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
<form onSubmit={handleSubmit} className="add-recipe-form" style={{ backgroundColor: 'transparent' }}>
        <h1>{recipeId ? 'Edit Recipe' : 'Add Recipe'}</h1>
        <input
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Recipe Name"
          required
        />
        <input
          name="description"
          value={recipe.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <textarea
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma separated)"
          required
        />
        <textarea
          name="instruction"
          value={recipe.instruction}
          onChange={handleChange}
          placeholder="Instructions"
          required
        />
      
         
        {errors.apiError && <p className="error">{errors.apiError}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <div>
          <button type="submit">{recipeId ? 'Update Recipe' : 'Add Recipe'}</button>
          <button type="button" onClick={handleBack} style={{ marginLeft: 20 }}>Back to Home</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
