import express from "express";
import routes from "./routes/index";
import { AppContext } from "./appContext";

export function createApp(appContext?: AppContext): express.Application {
  const app = express();
  app.use(express.json());

  const context = appContext || new AppContext();
  app.locals.appContext = context;

  app.use("/", routes);

  return app;
}
