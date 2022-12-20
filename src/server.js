import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import loginRoutes from "./routes/login.routes.js";
import urlRoutes from "./routes/urls.routes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(loginRoutes);
app.use(urlRoutes);

dotenv.config();
const port = process.env.SERVPORT || 5000;

app.listen(port, () => {
  console.log('Server listening on port ' + port + ' 🚀');
});
