import { createApp } from "./createApp";

const app = createApp();

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Stock market simulator running on http://localhost:${port}`);
});
