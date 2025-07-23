import { createRouter } from "@/lib/create-app";

import * as handlers from "./like.handlers";
import * as routes from "./like.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.toggle, handlers.toggle)
  .openapi(routes.getCount, handlers.getCount)
  .openapi(routes.getUserStatus, handlers.getUserStatus);

export default router;
