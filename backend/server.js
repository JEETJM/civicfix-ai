const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const env = require("./config/env");
const connectDB = require("./config/db");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const aiRoutes = require("./routes/aiRoutes");
const priorityRoutes = require("./routes/priorityRoutes");
const duplicateRoutes = require("./routes/duplicateRoutes");
const heatmapRoutes = require("./routes/heatmapRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const app = express();

connectDB();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* API routes */
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/complaints", complaintRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/priority", priorityRoutes);
app.use("/api/duplicates", duplicateRoutes);
app.use("/api/heatmap", heatmapRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
/* Local backend test route only */
if (env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to CivicFix AI Backend",
    });
  });
}

/* Production: serve React frontend */
if (env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 CivicFix AI server running on port ${env.PORT}`);
});
