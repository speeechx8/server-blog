import "dotenv/config";
import express from "express";
const app = express();
import routesRouter from "./controllers/routes.js";


// set json use
app.use(express.json());
// set static file
app.use(express.static("."));
// set route from handler
app.use("/", routesRouter);

// on server start
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server-blog listening on port ${process.env.SERVER_PORT}`);
});