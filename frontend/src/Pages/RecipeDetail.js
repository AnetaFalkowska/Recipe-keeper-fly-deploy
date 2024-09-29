import RecipeItem from "../components/RecipeItem";
import { useRouteLoaderData, redirect, json } from "react-router-dom";
import { API_URL } from '../config';

export default function RecipeDetailPage({type}) {
  const data = useRouteLoaderData(type==="library" ? "library-id" : "online-id");
  const recipe = type==="library" ? data.recipe : data.meals[0]
console.log(recipe)
  return <RecipeItem recipe={recipe} type={type} />;
}

export async function loader({ request, params }) {
  const id = params.id;
  const response = await fetch(`${API_URL}/recipes/` + id);

  if (!response.ok) {
    throw json({ message: "Could not fetch details for selected recipe" }, { status: 500 });
  }
  return response;
}

export async function onlineRecipeLoader({ request, params }) {
  const id = params.id;
  // const response = await fetch(`https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=6a07e1ba&app_key=%2053599fa750851728a2ed608df614e0e6%09`);
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  if (!response.ok) {
    throw json({ message: "Could not fetch details for selected recipe" }, { status: 500 });
  }

  return response;
}


export async function action({request, params}) {
  const recipeId = params.id
  
  const response = await fetch(`${API_URL}/recipes/` + recipeId, {method:request.method})
  if (!response.ok) {
    throw json({message:"Could not delete recipe"}, {status:500})
  }
  return redirect("/recipes")

}
