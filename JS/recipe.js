/* This is an JavaScript code for a meal search application. 
Author: Amruta Sangaonkar. */

// Get the recipe container element
const recipeContainer = document.getElementById('recipe-container');

// Get the recipe HTML from local storage
const recipeHTML = localStorage.getItem('recipeHTML');
// Set the recipe container's HTML to the recipe HTML
recipeContainer.innerHTML = recipeHTML;

// Set the base URL for the meal database API
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

