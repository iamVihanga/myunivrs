import { createRouter } from "@/lib/create-app";

import * as handlers from "./university.handlers";
import * as routes from "./university.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.remove, handlers.remove);

export default router;
