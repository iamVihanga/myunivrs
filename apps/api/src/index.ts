import createApp from "@/lib/create-app";
import configureOpenAPI from "@/lib/open-api-config";
import { registerRoutes } from "@/routes";

import env from "./env";

const app = registerRoutes(createApp());

configureOpenAPI(app);

export type AppType = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
};

// Test
