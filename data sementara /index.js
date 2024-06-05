import express from "express";
import cors from"cors";
import WasteRoute from "./routes/WasteRoute.js"

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(WasteRoute);

app.listen(port, ()=> console.log(`Server up and running in port ${port}`));