import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
// import { verifyToken } from "./middleware/authVerify.js";

//CONFIGURATION/MIDDLEWARES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
//INVOKE MIDDLEWARES
app.use(express.json()); //default middleware(used to extract req.body)
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));



//FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //any file saved,will be saved in destination folder.
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); //to upload files

//ROUTES WITH FILES FOR AUTHORIZATION
app.post('/auth/register',upload.single('picture'),register);
app.post('/posts',upload.single('picture',createPost));

//ROUTES
app.use('/auth',authRoutes);
app.use('/users',userRoutes);
app.use('/posts',postRoutes);

//MONGOOSE SETUP
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at the PORT:${PORT}`));
  })
  .catch((error) => console.log(error));
