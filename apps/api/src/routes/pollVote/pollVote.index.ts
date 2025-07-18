import { createRouter } from "@/lib/create-app";

import * as handlers from "./pollVote.handlers";
import * as routes from "./pollVote.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.remove, handlers.remove);

export default router;
