import { createRouter } from "@/lib/create-app";
import { AppOpenAPI } from "@/types";

import { BASE_PATH } from "../lib/constants";
import aboutUs from "./about-us/aboutus.index";
import adz from "./adz/adz.index";
import events from "./events/events.index";
import housing from "./housing/housing.index";
import index from "./index.route";
import jobs from "./jobs/jobs.index";
import sellswaps from "./sellswaps/sellswaps.index";
import tasks from "./tasks/tasks.index";
import university from "./university/university.index";

export function registerRoutes(app: AppOpenAPI) {
  return (
    app
      .route("/", index)
      .route("/tasks", tasks)
      .route("/housing", housing)
      .route("/jobs", jobs)
      .route("/university", university)
      .route("/events", events)
      // .route("/products", products)
      .route("/sellswaps", sellswaps)
      .route("/about-us", aboutUs)
      .route("/adz", adz)
  );
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;
