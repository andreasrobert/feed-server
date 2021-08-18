import express from "express";
import cors from "cors";
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

var PORT = Number(process.env.PORT || 4001);
var HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });