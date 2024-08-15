import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './RecipeList.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import cake from '../images/cake.jpg';
import pancakes from '../images/maincourse4.jpeg';
import spag from '../images/sidedish2.jpeg';
import salad from '../images/salad.jpg';
import quinche from '../images/beverages2.jpeg';

// Mapping category to image
const categoryImages = {
    MAINCOURSE: pancakes,
    SALAD: salad,
    SIDEDISH: spag,
    BAKED: cake,
    BEVERAGES: quinche,
};

function RecipeList({ recipes = [] }) {
    const navigate = useNavigate();

    const handleBtnHome = () => {
        navigate('/home');
    };

    const handleViewMore = () => {
        navigate('/RecipeDetail');
    };

    const groupedRecipes = recipes.reduce((groups, recipe) => {
        const category = recipe.category || 'Other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(recipe);
        return groups;
    }, {});

    return (
        <div className="recipe-list">
            <Carousel 
                showThumbs={false} 
                infiniteLoop 
                useKeyboardArrows 
                autoPlay 
                interval={2000}
                transitionTime={500}
                className='carousel'
            >
                {Object.keys(groupedRecipes).map(category => (
                    <div key={category} className="recipe-category">
                        <h2>{category}</h2>
                        <img 
                            src={categoryImages[category] || '/default-category.jpg'} 
                            alt={`${category} category`} 
                            className="category-image" 
                        />
                        <div className="recipe-grid">
                            {groupedRecipes[category].map(recipe => (
                                <div 
                                    key={recipe.id} 
                                    className="recipe-item" 
                                    onClick={() => handleViewMore(recipe.id)}
                                    role="button" 
                                    tabIndex="0"
                                >
                                    <img 
                                        src={recipe.image || '/default-image.jpg'} 
                                        alt={recipe.name} 
                                        className="recipe-image" 
                                    />
                                    <h3>{recipe.name}</h3>
                                    <p>{recipe.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Carousel>
            <div className="button-container1">
                <button onClick={handleViewMore} className="buttonvm">View More</button>
                <button onClick={handleBtnHome} className="buttonbk">Back to Home</button>
            </div>
        </div>
    );
}

RecipeList.propTypes = {
    recipes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            image: PropTypes.string,
            category: PropTypes.string,
        })
    ),
};

export default RecipeList;
