import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import { insertPollVoteSchema, selectPollVoteSchema } from "./pollVote.schema";

const tags: string[] = ["Poll Vote"];

export const list = createRoute({
  tags,
  summary: "List all votes for a poll",
  path: "/",
  method: "get",
  request: {
    query: z.object({
      ...queryParamsSchema.shape,
      pollId: z.string().optional(),
      optionId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectPollVoteSchema)),
      "The list of poll votes"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the votes"
    ),
  },
});

export const create = createRoute({
  tags,
  summary: "Cast a vote for a poll option",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertPollVoteSchema, "The vote to cast"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPollVoteSchema,
      "The cast vote"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid vote data or user has already voted"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single vote by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPollVoteSchema, "Requested vote"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Vote not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export const remove = createRoute({
  tags,
  summary: "Remove a vote",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Vote removed successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Vote not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type DeleteRoute = typeof remove;
