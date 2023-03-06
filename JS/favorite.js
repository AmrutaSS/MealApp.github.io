/* This is an JavaScript code for a meal search application. 
Author: Amruta Sangaonkar. */

// Select the favorite section from the DOM
const favoriteSection = document.querySelector('.section-cards');


// Set the base URL for the meal API
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';


// Function to create a meal card HTML element
function createMealCard(meal) {
  // Create a new div element for the card
  const card = document.createElement('div');
  card.classList.add('card');
  // Get the meal name, image URL, and ID from the meal object
  const mealName = meal.strMeal;
  const mealImage = meal.strMealThumb;
  const mealId = meal.idMeal;  // Create the card's HTML markup using template literals

  const cardHTML = `
    <img src="${mealImage}" alt="${mealName}" />
    <div class="card-details">
      <h3>${mealName}</h3>
      <button class="btn-view" data-meal-id="${mealId}">View Recipe</button>
      <button class="btn-delete" data-meal-id="${mealId}"><i class="fas fa-trash"></i></button>
    </div>
  `;
  
  // Add the card HTML to the card div element
  card.innerHTML = cardHTML;    
  return card;   // Return the card element
}

// Function to create a message HTML element
function createMessage(message) {
  // Create a new div element for the message
  const card = document.createElement('div');
  card.classList.add('message');
  // Set the message text content
  card.textContent = message;
  return card;  // Return the message element
}

// Function to render favorite meals on the page
function renderFavoriteMeals(favoriteMeals) {
  // Clear the favorite section of any existing HTML
  favoriteSection.innerHTML = '';
  // If there are no favorite meals, show a message
  if (favoriteMeals.length === 0) {
    const message = createMessage('You have no favorite meals yet!');
    // Style the message with CSS
    message.style.fontSize = '2rem';
    message.style.textAlign = 'center';
    message.style.color = '#130f40';
    message.style.marginTop = '4rem';
    // Add the message element to the favorite section
    favoriteSection.appendChild(message);
    return;
  }

  // For each favorite meal ID, fetch the meal data from the API and create a meal card
  favoriteMeals.forEach(mealId => {
    fetch(`${BASE_URL}lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        const meal = data.meals[0];
        const card = createMealCard(meal);
        // Add the card element to the favorite section
        favoriteSection.appendChild(card);
      })
      .catch(error => {
        const message = createMessage(`An error occurred: ${error}`);
        // Add the error message element to the favorite section
        favoriteSection.appendChild(message);
      });
  });
}

// Get the list of favorite meals from local storage or an empty array if none exist
const favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
// Render the favorite meals
renderFavoriteMeals(favoriteMeals);

// Add event listener to the favorite section to handle view button clicks
favoriteSection.addEventListener('click', event => {
  // Find the closest view button that was clicked
  const viewButton = event.target.closest('.btn-view');
  if (viewButton) {
    // Get the meal ID associated with the view button
    const mealId = viewButton.dataset.mealId;

    // Fetch the meal details from the API
    fetch(`${BASE_URL}lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        // Create a recipe card for the meal
        const meal = data.meals[0];
        const recipe = createRecipeCard(meal);
        const recipeHTML = recipe.outerHTML;
        // Save the recipe HTML in local storage
        localStorage.setItem('recipeHTML', recipeHTML);
        // Redirect the user to the recipe page
        window.location.href = 'recipe.html';
      })
      .catch(error => {
        // Handle errors by displaying a message to the user
        const message = createMessage(`An error occurred: ${error}`);
        favoriteSection.appendChild(message);
      });       
  }
});

// Add event listener to the favorite section to handle delete button clicks
favoriteSection.addEventListener('click', event => {
  // Find the closest delete button that was clicked
  const deleteButton = event.target.closest('.btn-delete');

    // Get the meal ID associated with the delete button
    const mealId = deleteButton.dataset.mealId;
    // Get the list of favorite meals from local storage or an empty array if none exist
    let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
    if (favoriteMeals.includes(mealId)) {
      // Remove the meal from the list of favorite meals
      favoriteMeals = favoriteMeals.filter(id => id !== mealId);
      localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
      // Show popup message
      const card = deleteButton.closest('.card');
      card.remove();
      const message = createMessage('The meal has been removed from your favorites.');
      message.style.fontSize = '2rem';
      message.style.textAlign = 'center';
      message.style.color = '#130f40';
      message.style.marginTop = '4rem';  
      favoriteSection.appendChild(message);
    }
  }
)


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






