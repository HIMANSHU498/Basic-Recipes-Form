const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const ejs = require("ejs");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static("./public"));
app.set("view engine", "ejs");
const Recipes = mongoose.model("recipes", {
  recipeName: String,
  recipeTime: String,
  ingredients: [],
  serves: String,
});

app.get("", (req, resp) => {
  Recipes.find()
    .then((item) => resp.render("Form", { item }))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.get("/newrecipes", (req, res) => {
  res.render("newRecipe");
});
app.post("/newrecipes", (req, resp) => {
  const { recipeName, recipeTime, ingredients, serves } = req.body;
  const recipes = new Recipes({
    recipeName: recipeName,
    recipeTime: recipeTime,
    ingredients: ingredients,
    serves: serves,
  });
  recipes
    .save()
    .then(() => resp.redirect("/"))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.get("/:id/edit", async (req, resp) => {
  const { id } = req.params;
  // const { recipeName, recipeTime, ingredients, serves } = req.body;
  const recipe = await Recipes.findById(id);

  Recipes.findByIdAndUpdate(id)
    .then(resp.render("editRecipe", { recipe }))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.post("/:id/edit", (req, resp) => {
  const { id } = req.params;
  const { recipeName, recipeTime, ingredients, serves } = req.body;

  Recipes.findByIdAndUpdate(id, {
    recipeName: recipeName,
    recipeTime: recipeTime,
    ingredients: ingredients,
    serves: serves,
  })
    .then(resp.redirect("/"))
    .catch((err) => resp.json({ err: "something went wrong" }));
});

app.post("/:id/delete", (req, resp) => {
  const { id } = req.params;

  Recipes.findByIdAndDelete(id)
    .then(resp.redirect("/"))
    .catch((err) => resp.json({ err: "something went wrong" }));
});
app.listen(process.env.PORT, () => {
  mongoose
    .connect(`${process.env.MONGODB_URL}/recipes`)
    .then(() => console.log("mongodb connected successfully"))
    .catch((err) => console.log(err));
  console.log("server running successfully");
});
