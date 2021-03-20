//Importing
import express from "express";
import {routes} from "./routes/index.js"
import path from 'path';
const __dirname = path.resolve();
//id config

const port = process.env.PORT || 8080;

//app config
const app = express();
global.__basedir = __dirname;

app.use(express.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(express.urlencoded({ extended: true }));


//api routes
routes(app)


//listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
