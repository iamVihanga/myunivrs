import { createRouter } from "@/lib/create-app";

import * as handlers from "./categories.handlers";
import * as routes from "./categories.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getProducts, handlers.getProducts);

export default router;
