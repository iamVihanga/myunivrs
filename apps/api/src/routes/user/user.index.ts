import { createRouter } from "@/lib/create-app";

import * as handlers from "./user.handlers";
import * as routes from "./user.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne);
// .openapi(routes.update, handlers.update)
// .openapi(routes.ban, handlers.ban)
// .openapi(routes.unban, handlers.unban)
// .openapi(routes.remove, handlers.remove);

export default router;
