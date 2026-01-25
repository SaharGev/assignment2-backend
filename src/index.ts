//index.js
import express, { Express} from 'express';
import mongoose from 'mongoose';
import postsRoute from './routes/postRoutes';
import commentsRoute from './routes/commentsRoute';
import userRoute from './routes/usersRoute';
import authRoute from './routes/authRoute';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.dev";
dotenv.config({ path: envFile });


const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use("/post", postsRoute);
app.use("/comments", commentsRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

const initApp = () => {
  const pr = new Promise<Express>((resolve, reject) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      reject("DATABASE_URL is not defined");
      return;
    }

    mongoose
      .connect(dbUrl, {})
      .then(() => {
        resolve(app);
      });

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
  });

  return pr;
};

export default initApp;