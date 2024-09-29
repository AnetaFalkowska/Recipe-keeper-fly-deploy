import {useLocation} from "react-router-dom"
import RecipeForm from "../components/RecipeForm";

export default function () {


  const location = useLocation();
  const recipeData = location.state?.newRecipe || {}
  return <RecipeForm method="post" recipe={recipeData}/>
}

