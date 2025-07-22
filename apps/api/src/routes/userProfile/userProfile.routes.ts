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

import {
  insertUserProfileSchema,
  selectUserProfileSchema,
  updateUserProfileSchema,
} from "./userProfile.schema";

const tags: string[] = ["UserProfile"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all user profiles",
  path: "/",
  method: "get",
  request: {
    query: z.object({
      ...queryParamsSchema.shape,
      username: z.string().optional(),
      universityName: z.string().optional(),
      courseOfStudy: z.string().optional(),
      yearsOfStudy: z
        .enum([
          "1st Year",
          "2nd Year",
          "3rd Year",
          "4th Year",
          "Graduate",
          "Postgraduate",
        ])
        .optional(),
      hasImages: z.enum(["true", "false"]).optional(), // Filter by whether profile has images
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectUserProfileSchema)),
      "The list of user profile entries"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the user profile entries"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new user profile entry",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertUserProfileSchema,
      "The user profile entry to create"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUserProfileSchema,
      "The created user profile entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single user profile entry by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserProfileSchema,
      "Requested user profile entry"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User profile entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Get current user's profile
export const getMe = createRoute({
  tags,
  summary: "Get current user's profile",
  method: "get",
  path: "/me",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserProfileSchema,
      "Current user's profile"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User profile not found"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing user profile entry",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateUserProfileSchema,
      "The user profile entry to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserProfileSchema,
      "The updated user profile entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to update this profile"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User profile entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Update current user's profile
export const updateMe = createRoute({
  tags,
  summary: "Update current user's profile",
  path: "/me",
  method: "put",
  request: {
    body: jsonContentRequired(
      updateUserProfileSchema,
      "The user profile updates"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserProfileSchema,
      "The updated user profile"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Delete route definition
export const remove = createRoute({
  tags,
  summary: "Delete a user profile entry",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "User profile entry deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to delete this profile"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User profile entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type GetMeRoute = typeof getMe;
export type UpdateRoute = typeof update;
export type UpdateMeRoute = typeof updateMe;
export type DeleteRoute = typeof remove;
