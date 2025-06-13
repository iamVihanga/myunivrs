import { createRouter } from "@/lib/create-app";
import { AppOpenAPI } from "@/types";

import { BASE_PATH } from "../lib/constants";
import events from "./events/events.index";
import housing from "./housing/housing.index";
import index from "./index.route";
import jobs from "./jobs/jobs.index";
import products from "./products/products.index";
import sellswaps from "./sellswaps/sellswaps.index";
import tasks from "./tasks/tasks.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/tasks", tasks)
    .route("/housing", housing)
    .route("/jobs", jobs)
    .route("/events", events)
    .route("/products", products)
    .route("/sellswaps", sellswaps);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;
