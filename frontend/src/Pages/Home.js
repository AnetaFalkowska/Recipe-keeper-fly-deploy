import { useLoaderData, json } from "react-router-dom";
import RandomRecipe from "../components/RandomRecipe";
import PageContent from "../components/UI/PageContent"
import { API_URL } from '../config';

export default function HomePage() {

const data = useLoaderData()

  return (
    <PageContent title="Browse your favorite recipes or discover a new one online!">
      {data.recipe && <RandomRecipe recipe={data.recipe}/>}
    </PageContent>
  );
}

export async function loader() {
  const response = await fetch(`${API_URL}/recipes/random`)

  if (!response.ok) {
    throw json({ message: "Could not fetch details for random recipe" }, { status: 500 });
  }

  return response;
}
