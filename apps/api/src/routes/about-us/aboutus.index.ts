import { createRouter } from "@/lib/create-app";

import * as handlers from "./aboutus.handlers";
import * as routes from "./aboutus.routes";

const router = createRouter()
  .openapi(routes.update, handlers.update)
  .openapi(routes.get, handlers.get);

export default router;
