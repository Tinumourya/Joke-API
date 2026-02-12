const express = require("express");
const router = express.Router();
const axios = require("axios");
const Joke = require("../models/Joke");


// ---- GET RANDOM ----
router.get("/random", async (req, res, next) => {
  try {
    const joke = await Joke.aggregate([{ $sample: { size: 1 } }]);

    if (!joke.length) {
      const error = new Error("No jokes found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: joke[0]
    });

  } catch (error) {
    next(error);
  }
});


// ---- GET ALL ----
router.get("/", async (req, res, next) => {
  try {
    const jokes = await Joke.find();

    res.json({
      success: true,
      count: jokes.length,
      data: jokes
    });

  } catch (error) {
    next(error);
  }
});


// ---- POST BATCH (MOVED ABOVE :id) ----
router.post("/batch", async (req, res, next) => {
  try {
    const { count } = req.body;

    if (!count || count <= 0) {
      const error = new Error("Valid count is required");
      error.statusCode = 400;
      throw error;
    }

    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_ten"
    );

    const jokes = response.data.slice(0, count);

    const formattedJokes = jokes.map(j => ({
      type: j.type,
      setup: j.setup,
      punchline: j.punchline
    }));

    const savedJokes = await Joke.insertMany(formattedJokes);

    res.status(201).json({
      success: true,
      message: `${savedJokes.length} jokes added successfully`,
      data: savedJokes
    });

  } catch (error) {
    next(error);
  }
});


// ---- GET BY ID (KEEP BELOW BATCH) ----
router.get("/:id", async (req, res, next) => {
  try {
    const joke = await Joke.findById(req.params.id);

    if (!joke) {
      const error = new Error("Joke not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: joke
    });

  } catch (error) {
    next(error);
  }
});


// ---- PUT UPDATE ----
router.put("/:id", async (req, res, next) => {
  try {
    const { setup, punchline, type } = req.body;

    const updateFields = {};
    if (setup) updateFields.setup = setup;
    if (punchline) updateFields.punchline = punchline;
    if (type) updateFields.type = type;

    if (Object.keys(updateFields).length === 0) {
      const error = new Error("At least one field is required to update");
      error.statusCode = 400;
      throw error;
    }

    const updatedJoke = await Joke.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedJoke) {
      const error = new Error("Joke not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: "Joke updated successfully",
      data: updatedJoke
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
