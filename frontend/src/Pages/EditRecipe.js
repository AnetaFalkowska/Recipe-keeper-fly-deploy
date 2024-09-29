import RecipeForm from "../components/RecipeForm"
import { useRouteLoaderData } from "react-router-dom";

export default function EditRecipePage() {

    const data = useRouteLoaderData("library-id");

    return <RecipeForm recipe={data.recipe} method="patch"/>
}
