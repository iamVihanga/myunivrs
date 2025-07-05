import { createRouter } from "@/lib/create-app";

import * as handlers from "./organizations.handlers";
import * as routes from "./organizations.routes";

const router = createRouter().openapi(routes.list, handlers.list);

export default router;
