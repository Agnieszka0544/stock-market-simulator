import express from "express";
import routes from "./routes/index";

const app = express();
app.use(express.json());

app.use("/", routes);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Stock market simulator running on http://localhost:${port}`);
});
