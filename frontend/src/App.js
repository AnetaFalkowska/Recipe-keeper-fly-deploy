import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {lazy, Suspense} from 'react';
import classes from "./App.module.css";

const RootPage = lazy(()=>import("./Pages/Root"));
const ErrorPage = lazy(()=>import("./Pages/Error"));
const HomePage = lazy(()=>import("./Pages/Home"));
const RecipesPage = lazy(()=>import("./Pages/Recipes"));
const RecipeDetailPage = lazy(()=>import("./Pages/RecipeDetail"));
const NewRecipePage = lazy(()=>import("./Pages/NewRecipe"));
const EditRecipePage = lazy(()=>import("./Pages/EditRecipe"));
const SearchResultsPage = lazy(()=>import("./Pages/SearchResults"));
const InProgressPage = lazy(()=>import("./Pages/InProgress"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><RootPage /></Suspense>,
    errorElement: <Suspense fallback={<p>Loading...</p>}><ErrorPage /></Suspense>,
    children: [
      {
        index: true,
        loader: ()=>import("./Pages/Home").then(module=>module.loader()),
        element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><HomePage /></Suspense>,
      },
      {
        path: "recipes",
        // element: <RecipesRootPage />,
        id: "my-recipes",
        loader: ()=>import("./Pages/Recipes").then(module=>module.loader()),
        children: [
          {
            index: true,
            element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><RecipesPage /></Suspense>,
          },
          {
            path: ":id/:slug",
            id: "library-id",
            loader: (meta)=>import("./Pages/RecipeDetail").then(module=>module.loader(meta)),
            children: [
              {
                index: true,
                element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><RecipeDetailPage type="library"/></Suspense>,
                action: (meta)=>import("./Pages/RecipeDetail").then(module=>module.action(meta)),
              },
              {
                path: "edit",
                element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><EditRecipePage /></Suspense>,
                action: (meta)=>import("./components/RecipeForm").then(module=>module.action(meta)),
                loader: ()=>import("./components/RecipeForm").then(module=>module.loader()),
              },
            ],
          },
          {
            path: "new",
            element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><NewRecipePage /></Suspense>,
            action: (meta)=>import("./components/RecipeForm").then(module=>module.action(meta)),
            loader: ()=>import("./components/RecipeForm").then(module=>module.loader()),
          },
          {
            path: "search",
            element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><SearchResultsPage type="library"/></Suspense>,
          },
        ],
      },
      {
        path: "search-online",
        id: "online-recipes",
        loader: (meta)=>import("./Pages/SearchResults").then(module=>module.onlineRecipesLoader(meta)),
        element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><SearchResultsPage type="online"/></Suspense>,
      },
      {
        path: "search-online/:id",
        id: "online-id",
        loader: (meta)=>import("./Pages/RecipeDetail").then(module=>module.onlineRecipeLoader(meta)),
        element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><RecipeDetailPage type="online"/></Suspense>,
      },
      {
        path: "account",
        element: <Suspense fallback={<p className={classes.loading}>Loading...</p>}><InProgressPage/></Suspense>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


