require("dotenv").config();
require("./helpers/init_mongodb");
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", require("./Routes/Auth.Route"));
app.use("/contact", require("./Routes/Contact.Route"));
app.use("/user", require("./Routes/User.Route"));
app.use("/file", require("./Routes/File.Route"));
app.use("/blogs", require("./Routes/Blog.Route"));
app.use("/projects", require("./Routes/Project.Route"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", async (req, res, next) => {
  res.send("hello .....");
});

app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exist "));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
Database ${process.env.MONGODB_URI}
Server Running on port ${PORT}`
);
});