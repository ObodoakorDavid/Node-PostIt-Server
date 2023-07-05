/** @format */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3002;
const cors = require("cors");
const notFoundMiddleware = require("./middleware/notfound");
const errorHandleMiddleware = require("./middleware/error");
const authRouter = require("./routes/authRouter");
const postsRouter = require("./routes/postsRouter");
const authenticationMiddleware = require("./middleware/authMiddleware");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

// app.use(
//   cors({
//     origin: `http://localhost:3000`,
//   })
// );
// cloudinary.config({
//   cloud_name: process.env.CLOUNINARY_CLOUD_NAME,
//   api_key: process.env.CLOUNINARY_API_KEY,
//   api_secret: process.env.CLOUNINARY_API_SECRET,
// });

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRouter);
// app.use("/api/post", authenticationMiddleware, postsRouter);
app.use("/api/post", postsRouter);

app.use(errorHandleMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`DB Connected!`);
    app.listen(port, console.log(`Server Listening on port ${port} `));
  } catch (error) {
    // console.log(error);
    console.log(`Can't connect because of ${error}`);
  }
};

start();
