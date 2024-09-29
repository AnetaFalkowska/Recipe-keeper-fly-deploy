import { useRouteLoaderData, json } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import { API_URL } from '../config';

export default function RecipesPage() {
  const recipes = useRouteLoaderData("my-recipes");
  return <RecipeList recipes={recipes.recipes} />;
}

export async function loader() {
  const response = await fetch(`${API_URL}/recipes/`);
  if (!response.ok) {
    throw json({ message: "Could not fetch recipes" }, { status: 500 });
  }
  return response;
}
