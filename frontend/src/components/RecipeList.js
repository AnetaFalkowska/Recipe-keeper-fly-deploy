import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import classes from "./RecipeList.module.css";
import FoodImg from "../assets/food.png";
import Button from "./UI/Button"

function defaultImg(e) {
  e.target.src = FoodImg;
}

function renderLibraryRecipe(recipe) {
  const image = recipe.imageUrl || FoodImg;
  return (
    <li key={recipe.id}>
      <Link to={`/recipes/${recipe.id}/${recipe.slug}`} id={`recipe-${recipe.id}`} className={classes["recipe-item"]}>
        <img src={image} alt="dish" onError={defaultImg} />
        <p>{recipe.title}</p>
      </Link>
    </li>
  );
}

function renderOnlineRecipe(recipe) {
  // const recipeId = recipe.uri.split("_")[1];
  const image = recipe.strMealThumb || FoodImg;
  return (
    <li key={recipe.idMeal}>
      <Link
        to={`/search-online/${recipe.idMeal}`}
        className={classes["recipe-item"]}
      >
        <img src={image} alt="dish" onError={defaultImg} />
        <p>{recipe.strMeal}</p>
      </Link>
    </li>
  );
}

export default function RecipeList({ recipes, type, searchItem }) {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const highlightedRecipeId = params.get("highlightedRecipeId");


  useEffect(() => {
    if (highlightedRecipeId) {
      const newRecipeElement = document.querySelector(
        `#recipe-${highlightedRecipeId}`
      );
      if (newRecipeElement) {
        newRecipeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        newRecipeElement.classList.add(classes.highlight);
        setTimeout(() => {
          newRecipeElement.classList.remove(classes.highlight);   
        }, 1500);
      }
    }
  }, [highlightedRecipeId, classes.highlight]);

  const renderRecipeItem =
    !type || type === "library" ? renderLibraryRecipe : renderOnlineRecipe;

  if (searchItem && (!recipes || recipes.length === 0)) {
    return <h2>No recipes found for the query: {searchItem}</h2>;
  }
  if (!searchItem && (!recipes || recipes.length === 0)) {
    return <div className={classes.fallback}>
      <h2>No recipes found in your collection</h2>
    <p>
      Click <Button Container={Link} textOnly to="/recipes/new">here</Button> to add a new recipe, or search for a recipe online.
    </p>
    </div>;
  }

  return (
    <div className={classes.recipes}>
      {type && (
        <h2>
          {type === "online"
            ? "Recipes found online"
            : "Finds from your recipe collection"}
        </h2>
      )}
      <ul className={classes.list}>{recipes.map(renderRecipeItem)}</ul>
    </div>
  );
}

// name
// imageUrl
// source
// ingredients
// directions
