const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static("./public"));
const Recipes = mongoose.model("recipes", {
  recipeName: String,
  recipeTime: String,
  ingredients: Array,
  serves: String,
});
app.get("", (req, res) => {
  res.send("Welcome to food recipes");
});
app.get("/recipes", (req, resp) => {
  Recipes.find()
    .then((item) => resp.json(item))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.post("/recipes", (req, resp) => {
  const { recipeName, recipeTime, ingredients, serves } = req.body;
  const recipes = new Recipes({
    recipeName: recipeName,
    recipeTime: recipeTime,
    ingredients: ingredients,
    serves: serves,
  });
  recipes
    .save()
    .then(() => resp.json("Recipes saved successfully"))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.put("/recipes/:id", (req, resp) => {
  const { id } = req.params;
  const { recipeName, recipeTime, ingredients, serves } = req.body;

  Recipes.findByIdAndUpdate(id, { recipeName: recipeName })
    .then((item) => resp.json(item))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.delete("/recipes/:id", (req, resp) => {
  const { id } = req.params;
  const { recipeName, recipeTime, ingredients, serves } = req.body;

  Recipes.findByIdAndDelete(id)
    .then((item) => resp.json(item))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.listen(process.env.PORT, () => {
  mongoose
    .connect(`${process.env.MONGODB_URL}/recipes`)
    .then(() => console.log("mongodb connected successfully"))
    .catch((err) => console.log(err));
  console.log("server running successfully");
});
