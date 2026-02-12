const express = require("express");
const app = express();

const jokeRoutes = require("./routes/jokeRoutes");
const errorHandler = require('../middlewares/errorMiddleware')


// Middleware
app.use(express.json());

// Routes
app.use("/api/jokes", jokeRoutes);

app.get("/", (req, res) => {
  res.send("Joke API is running");
});

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

module.exports = app;
