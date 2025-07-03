import { createRouter } from "@/lib/create-app";

import * as handlers from "./b2bplans.handlers";
import * as routes from "./b2bplans.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);
  
export default router;
