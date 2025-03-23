import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import slotRoutes from "./routes/slotRoute.js";

const app = express(); // ✅ Define app BEFORE using it

// Middleware
app.use(express.json()); // ✅ Now it's fine
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to Database
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// Routes
app.use("/api/slots", slotRoutes);

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
