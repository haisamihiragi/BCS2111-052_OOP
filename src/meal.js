document.addEventListener("DOMContentLoaded", function () {
  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=japanese")
    .then(response => response.json())
    .then(data => {
      const meals = data.meals.slice(0, 5).map(meal => meal.idMeal);
      Promise.all(meals.map(id => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(response => response.json())))
        .then(details => {
          const mealsData = details.map(detail => ({
            name: detail.meals[0].strMeal,
            picture: detail.meals[0].strMealThumb,
            ingredients: Object.entries(detail.meals[0])
              .filter(entry => entry[0].startsWith("strIngredient") && entry[1] !== "")
              .map(entry => entry[1])
          }));
          const mealsContainer = document.getElementById("meals");
          mealsData.forEach(meal => {
            const mealElement = document.createElement("div");
            const nameElement = document.createElement("h1");
            const pictureElement = document.createElement("img");
            const button = document.createElement("button"); // Create a button element
            const ingredientsList = document.createElement("ol");
            button.textContent = "Show Ingredients"; // Set the button text content
            button.addEventListener("click", () => { // Add a click event listener to the button
              if (ingredientsList.style.display === "none") {
                ingredientsList.style.display = "block"; // Show the ingredients list
                button.textContent = "Hide Ingredients"; // Update the button text content
              } else {
                ingredientsList.style.display = "none"; // Hide the ingredients list
                button.textContent = "Show Ingredients"; // Update the button text content
              }
            });
            nameElement.textContent = meal.name;
            pictureElement.src = meal.picture;
            ingredientsList.style.display = "none"; // Hide the ingredients list by default
            mealElement.appendChild(nameElement);
            mealElement.appendChild(pictureElement);
            mealElement.appendChild(button); // Add the button element to the meal element
            mealElement.appendChild(ingredientsList);
            meal.ingredients.forEach(ingredient => {
              const ingredientElement = document.createElement("li");
              ingredientElement.textContent = ingredient;
              ingredientsList.appendChild(ingredientElement);
            });
            mealsContainer.appendChild(mealElement);
          });
        });
    })
    .catch(error => console.error(error));
});
