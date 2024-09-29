const fs = require('node:fs/promises');


const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');

function generateSlug(title) {
  return title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .trim() 
  .replace(/\s+/g, '-')
  .replace(/--+/g, '-')
}

async function readData() {
  const data = await fs.readFile('recipes.json', 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile('recipes.json', JSON.stringify(data));
}

async function getAll() {
  const storedData = await readData();
  if (!storedData.recipes) {
    throw new NotFoundError('Could not find any recipes.');
  }
  return storedData.recipes;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.recipes || storedData.recipes.length === 0) {
    throw new NotFoundError('Could not find any recipes.');
  }

  const recipe = storedData.recipes.find((re) => re.id === id);
  if (!recipe) {
    throw new NotFoundError('Could not find recipe for id ' + id);
  }

  return recipe;
}

async function add(data) {
  const storedData = await readData();
  const newRecipe = { ...data, id: generateId(), slug:generateSlug(data.title) }
  storedData.recipes.unshift(newRecipe);
  await writeData(storedData);
  return newRecipe
}

async function replace(id, data) {
  const storedData = await readData();

  if (!storedData.recipes || storedData.recipes.length === 0) {
    throw new NotFoundError('Could not find any recipes.');
  }

  const index = storedData.recipes.findIndex((recipe) => recipe.id === id);
  if (index < 0) {
    throw new NotFoundError('Could not find recipes for id ' + id);
  }
const updatedRecipe = { ...data, id: generateId(), slug:generateSlug(data.title) }
  storedData.recipes[index] = updatedRecipe;

  await writeData(storedData);
  return updatedRecipe;
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.recipes.filter((re) => re.id !== id);
  await writeData({recipes: updatedData});
}

async function getRandom() {
  const storedData = await readData();
  if (!storedData.recipes) {
    throw new NotFoundError('Could not find any recipes.');
  }
  const randomIndex = Math.floor(Math.random() * storedData.recipes.length);
  return storedData.recipes[randomIndex];
  
}

async function getTitles() {
  const storedData = await readData();
  if (!storedData.recipes) {
    throw new NotFoundError('Could not find any recipes.');
  }
  const titles = storedData.recipes.map(el=>el.title)
  return titles;
  
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
exports.getRandom = getRandom;
exports.getTitles = getTitles;