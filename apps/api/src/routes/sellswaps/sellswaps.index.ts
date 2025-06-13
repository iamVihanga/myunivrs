import { createRouter } from "@/lib/create-app";

import * as handlers from "./sellswaps.handlers";
import * as routes from "./sellswaps.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getByCategory, handlers.getByCategory)
  .openapi(routes.getMyListings, handlers.getMyListings);

export default router;
