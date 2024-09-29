import {useMemo} from 'react';
import { useLocation, useRouteLoaderData, json } from "react-router-dom";
import RecipeList from "../components/RecipeList";

function filterRecipes(recipes, searchItem) {
  return recipes.filter(
    (recipe) =>
      recipe.title
        .toLocaleLowerCase()
        .includes(searchItem.toLocaleLowerCase()) ||
      recipe.ingredients
        .toLocaleLowerCase()
        .includes(searchItem.toLocaleLowerCase())
  );
}

export default function SearchResultsPage({ type }) {
  const data = useRouteLoaderData(
    type === "library" ? "my-recipes" : "online-recipes"
  );
  const location = useLocation();
  const searchItem = new URLSearchParams(location.search).get("query")
  // const searchItem = location.state;
  const searchResults = useMemo(() => {
    if (type === "library") {
      const { recipes: allRecipes } = data;
      if (allRecipes && searchItem) {
        return filterRecipes(allRecipes, searchItem);
      }
      return [];
    } else {
      return data.meals
      // const { hits: onlineRecipes } = data;
      // if (onlineRecipes) {
      //   return onlineRecipes.map((hit) => hit.recipe);
      // }
      // return [];
    }
  }, [type, data, searchItem]);

  return <RecipeList type={type} recipes={searchResults} searchItem={searchItem} />;
}

export async function onlineRecipesLoader({ params, request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const response = await fetch(
    // `https://api.edamam.com/search?q=${query}&app_id=6a07e1ba&app_key=53599fa750851728a2ed608df614e0e6`
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );

  if (!response.ok) {
    throw json({ message: "Could not fetch recipes" }, { status: 500 });
  }
  return response;
}
