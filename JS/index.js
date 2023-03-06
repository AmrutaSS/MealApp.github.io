/* This is an JavaScript code for a meal search application. 
Author: Amruta Sangaonkar. */

// Select DOM elements
const form = document.querySelector('.form-meal');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const sectionCards = document.querySelector('.section-cards');

// Define the API endpoint URL
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

// Event listener for the form submission
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page from reloading on form submission
  const searchTerm = searchInput.value;
  if (searchTerm.trim() !== '') { // Check that search term is not empty
    fetch(`${BASE_URL}search.php?s=${searchTerm}`) // Fetch meals from API
      .then(response => response.json())
      .then(data => {
        sectionCards.innerHTML = ''; // Clear the sectionCards element
        if (data.meals) { // If meals are found
          data.meals.forEach(meal => {
            const card = createMealCard(meal); // Create a meal card for each meal
            sectionCards.appendChild(card); // Add the card to the sectionCards element
          });
        } else { // If no meals are found
          const message = createMessage('No meals found.');
          message.style.fontSize = '2rem';
          message.style.textAlign = 'center';
          message.style.color = '#130f40';
          message.style.marginTop = '4rem';
          sectionCards.appendChild(message); // Display a message
        }
      })
      .catch(error => { // Handle errors
        const message = createMessage(`An error occurred: ${error}`);
        sectionCards.appendChild(message);
      });
  }
});

// Function to create a meal card
function createMealCard(meal) {
  const card = document.createElement('div');
  card.classList.add('card');
  const mealName = meal.strMeal;
  const mealImage = meal.strMealThumb;
  const mealId = meal.idMeal;
  const cardHTML = `
    <img src="${mealImage}" alt="${mealName}" />
    <div class="card-details">
      <h3>${mealName}</h3>
      <button class="btn-view" data-meal-id="${mealId}">View Recipe</button>
      <button class="btn-favorite" data-meal-id="${mealId}"><i class="far fa-heart"></i></button>
    </div>
  `;
  card.innerHTML = cardHTML; // Set card HTML content   
  return card; // Return the card element 
}

// Function to create a message element
function createMessage(message) {
  const card = document.createElement('div');
  card.classList.add('message');
  card.textContent = message;
  return card;
}

// Event listener for the View Recipe button
sectionCards.addEventListener('click', event => {
  const viewButton = event.target.closest('.btn-view');
  if (viewButton) {
    const mealId = viewButton.dataset.mealId;
    fetch(`${BASE_URL}lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        const meal = data.meals[0];
        const recipe = createRecipeCard(meal);
        const recipeHTML = recipe.outerHTML;
        localStorage.setItem('recipeHTML', recipeHTML);
        window.location.href = 'recipe.html'; // Navigate to recipe page
      })
      .catch(error => {
        const message = createMessage(`An error occurred: ${error}`);
        sectionCards.appendChild(message);
      });      
  }
});

// Event listener for the Favorite button
sectionCards.addEventListener('click', event => {
  const viewButton = event.target.closest('.btn-view');
  const favoriteButton = event.target.closest('.btn-favorite');
  if (viewButton) {
    // Do nothing if the View button is clicked
  } else if (favoriteButton) {
    const mealId = favoriteButton.dataset.mealId; // Get the meal ID from the datase
    let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || []; // Get the list of favorite meals from localStorage, or an empty array if none exist
    if (!favoriteMeals.includes(mealId)) { // Add the meal ID to the favorite meals list if it's not already included
      favoriteMeals.push(mealId);
      localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals)); // Save the updated list of favorite meals to localStorage
      
      // Update the favorite button icon to a filled heart
      favoriteButton.innerHTML = '<i class="fas fa-heart"></i>';
    } else { // Remove the meal ID from the favorite meals list if it's already included
      favoriteMeals = favoriteMeals.filter(id => id !== mealId);
      localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals)); // Save the updated list of favorite meals to localStorage
      // Update the favorite button icon to an empty heart
      favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
      favoriteButton.style.color = 'red'; // Change the heart color to red to indicate removal from favorites
    }
  }
});

// Function to create a recipe card
function createRecipeCard(meal) {
  const card = document.createElement('div'); // Create a new div element for the card
  card.classList.add('card'); // Add the 'card' class to the div element
  card.style.width = '70%';  // Set the width of the card to 70% of the page
  card.style.textAlign = 'center';  // Center align the card content 
  card.style.marginLeft = '23rem'; // Add a left margin to the card to center it on the page 

  const mealName = meal.strMeal; // Get the meal name from the API response
  const mealImage = meal.strMealThumb; // Get the meal image URL from the API response
  const mealInstructions = meal.strInstructions; // Get the meal instructions from the API response
  const ingredients = getIngredients(meal); // Call the 'getIngredients' function to get the list of ingredients and measurements

  const cardImage = document.createElement('img'); // Create a new img element for the meal image
  cardImage.src = mealImage; // Set the src attribute of the img element to the meal image URL
  cardImage.alt = mealName; // Set the alt attribute of the img element to the meal name
  cardImage.style.maxWidth = '50%';  // Set max width of image to maintain aspect ratio
  cardImage.style.marginTop = '2rem'; // Add a top margin to the image for spacing


  const cardDetails = document.createElement('div'); // Create a new div element for the card details
  cardDetails.classList.add('card-details');  // Add the 'card-details' class to the div element
  cardDetails.style.textAlign = 'center';  // Center align the card details content

  const cardName = document.createElement('h3');  // Create a new h3 element for the meal name
  cardName.textContent = mealName;  // Set the text content of the h3 element to the meal name
  cardName.style.fontSize = '20px'; // Set the font size of the meal name
  cardName.style.color = '#ff7800';  // Set the color of the meal name
  cardName.style.marginBottom = '2rem'; // Add a bottom margin to the meal name for spacing

  const cardIngredientsHeading = document.createElement('h4'); // Create a new h4 element for the ingredients heading
  cardIngredientsHeading.textContent = 'Ingredients:';  // Set the text content of the h4 element to 'Ingredients:'
  cardIngredientsHeading.style.fontSize = '16px';  // Set the font size of the ingredients heading
  cardIngredientsHeading.style.color = '#ff7800';  // Set the color of the ingredients heading


  const cardIngredientsList = document.createElement('ul');  // Create a new ul element for the ingredients list
  cardIngredientsList.style.fontSize = '16px'; // Set the font size of the ingredients list
  cardIngredientsList.innerHTML = ingredients;  // Set the inner HTML of the ingredients list to the result of the 'getIngredients' function
  cardIngredientsList.style.marginBottom = '2rem'; // Add a bottom margin to the ingredients list for spacing
  cardIngredientsList.style.color = '#130f40'; // Set the color of the ingredients list


  const cardInstructionsHeading = document.createElement('h4'); // Create a new h4 element for the instructions heading
  cardInstructionsHeading.style.color = '#ff7800'; // Set the color of the instructions heading
  cardInstructionsHeading.textContent = 'Instructions:';  // Set the text content of the h4 element to 'Instructions:'
  cardInstructionsHeading.style.fontSize = '16px'; fontSize = '16px'; // set the font size of card instructions heading to 16px


  const cardInstructions = document.createElement('p');  // create a new paragraph element to hold meal instructions
  cardInstructions.textContent = mealInstructions;  // set the text content of the paragraph element to the meal instructions
  cardInstructions.style.fontSize = '16px';// set the font size of the paragraph element to 16px
  cardInstructions.style.textAlign = 'justify';  // justify the text of the paragraph element
  cardInstructions.style.margin = '2rem';  // set a margin of 2rem to the paragraph element
  cardInstructions.style.color = '#130f40';  // set the color of the paragraph element to #130f40


  cardDetails.append(cardName, cardIngredientsHeading, cardIngredientsList, cardInstructionsHeading, cardInstructions);  // add the card name, ingredients heading, ingredients list, instructions heading and instructions paragraph element to the card details container
  card.append(cardImage, cardDetails);  // add the card image and card details container to the card

  return card; // return the completed card
}

function getIngredients(meal) {
  let ingredients = '';  // create an empty string to hold the list of ingredients
  for (let i = 1; i <= 20; i++) {  // loop through the first 20 ingredient and measure properties of the meal object
    const ingredient = meal[`strIngredient${i}`];  // get the ingredient at the current index
    const measure = meal[`strMeasure${i}`];  // get the measure at the current index
    if (ingredient !== '' && ingredient !== null) {  // check if the ingredient exists and is not empty or null
      ingredients += `<li>${ingredient} - ${measure}</li>`;  // add the ingredient and measure to the ingredients list
    }
  }
  return ingredients;  // return the completed ingredients list
}





