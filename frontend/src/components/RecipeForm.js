import {
  Form,
  json,
  redirect,
  useNavigate,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import classes from "./RecipeForm.module.css";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
import { API_URL } from "../config";

function isValidTitle(title) {
  return title.trim().length >= 3 && title.trim().length <= 80;
}

export default function RecipeForm({ recipe, method }) {
  const [openModal, setOpenModal] = useState(false);
  const [enteredTitle, setEnteredTitle] = useState(recipe?.title || "");
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isTitleTaken, setIsTitleTaken] = useState(false);

  const { titles } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigate();
  const isSubmitting = navigation.state === "submitting"

  function handleTitleChange(e) {
    setEnteredTitle(e.target.value);
    setIsTitleTaken(false);
  }

  function handleTitleBlur() {
    enteredTitle && setIsTitleValid(isValid);
  }

  function handleTitleFocus() {
    setIsTitleValid(true);
  }

  function handleConfirmCancel() {
    navigate("/recipes");
  }

  useEffect(() => {
    if (titles.length !== 0) {
      function checkTitleAvailability() {
        const existingTitle =
        (method === "post" && titles.includes(enteredTitle.trim())) ||
        (method === "patch" &&
          titles.includes(enteredTitle.trim()) &&
          enteredTitle.trim() !== recipe?.title);
        setIsTitleTaken(existingTitle);
      }
      const timer = setTimeout(checkTitleAvailability, 200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [titles, enteredTitle, recipe?.title]);

  const actions = (
    <>
      <Button
        textOnly
        onClick={() => {
          setOpenModal(false);
        }}
      >
        No
      </Button>
      <Button onClick={handleConfirmCancel}>Yes</Button>
    </>
  );

  const isValid = isValidTitle(enteredTitle);
  const disabled = !isValid || isTitleTaken;

  return (
    <>
      <Modal
        open={openModal}
        title="Are you sure?"
        message="Do you really want to discard changes?"
        actions={actions}
        onClose={() => {
          setOpenModal(false);
        }}
      ></Modal>
      <Form method={method} className={classes.form}>
        <p>
          <label htmlFor="title">
            Title <span className={classes.required}>(required)</span>
          </label>
          <input
            className={`${
              !isTitleValid || isTitleTaken ? classes.invalid : ""
            }`}
            type="text"
            id="title"
            name="title"
            required
            onBlur={handleTitleBlur}
            onChange={handleTitleChange}
            onFocus={handleTitleFocus}
            defaultValue={recipe && recipe.title ? recipe.title : ""}
          ></input>
          {!isTitleValid && (
            <p className={classes["invalid-message"]}>
              Title should be between 3 and 80 characters long.
            </p>
          )}
          {isTitleTaken && (
            <p className={classes["invalid-message"]}>
              That title is already taken. Try a different one!
            </p>
          )}
        </p>
        <p>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            defaultValue={recipe && recipe.imageUrl ? recipe.imageUrl : ""}
          ></input>
        </p>
        <p>
          <label htmlFor="source">Source / Online URL</label>
          <input
            type="text"
            id="source"
            name="source"
            defaultValue={recipe && recipe.source ? recipe.source : ""}
          ></input>
        </p>
        <p>
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            rows="8"
            id="ingredients"
            name="ingredients"
            defaultValue={
              recipe && recipe.ingredients ? recipe.ingredients : ""
            }
          ></textarea>
        </p>
        <p>
          <label htmlFor="directions">Directions</label>
          <textarea
            rows="8"
            id="directions"
            name="directions"
            defaultValue={recipe && recipe.directions ? recipe.directions : ""}
          ></textarea>
        </p>

        <div className={classes.actions}>
          <Button
            textOnly
            type="button"
            onClick={() => {
              setOpenModal(true);
              disabled={isSubmitting}
            }}
          >
            Cancel
          </Button>
          <Button
            className={disabled ? classes["save-button"] : ""}
            disabled={disabled || isSubmitting}
                >
            {isSubmitting ? "Submitting" : "Save Recipe"}
          </Button>
        </div>
      </Form>
    </>
  );
}

export async function action({ request, params }) {
  const data = await request.formData();

  const ingredients = data.get("ingredients")
    ? data.get("ingredients").replace(/\n/g, "\n")
    : "";
  const directions = data.get("directions")
    ? data.get("directions").replace(/\n/g, "\n")
    : "";

  const recipeData = {
    title: data.get("title"),
    imageUrl: data.get("imageUrl"),
    source: data.get("source"),
    ingredients,
    directions,
  };

  let method = request.method;

  let url = `${API_URL}/recipes`;
  if (method === "PATCH") {
    const recipeId = params.id;
    console.log(recipeId);
    url = `${API_URL}/recipes/` + recipeId;
  }

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipeData),
  });
  if (!response.ok) {
    throw json({ message: "Could not save recipe" }, { status: 500 });
  }
  const responseData = await response.json();
  const highlightedRecipeId = responseData.recipe.id;
  return redirect(`/recipes?highlightedRecipeId=${highlightedRecipeId}`);
}

export async function loader() {
  const response = await fetch(`${API_URL}/recipes/titles`);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch titles for your recipes" },
      { status: 500 }
    );
  }

  return response;
}
