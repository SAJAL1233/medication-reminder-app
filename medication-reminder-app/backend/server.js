require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./database");

// Route imports
const userRoutes = require("./routes/Users");
const authRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medicationRoutes"); // Includes public and protected routes

// Connect to database
connection();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes); // Public create route, protected others (handled inside)

const PORT = process.env.PORT || 8080;
app.listen(PORT,() => console.log(`🚀 Server listening on port ${PORT}`));
