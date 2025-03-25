import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.listen(port, function () {
    console.log(`Server is running on ${port}`);
  });
dotenv.config();
