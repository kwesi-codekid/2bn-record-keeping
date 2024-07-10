import type { LoaderFunction } from "@remix-run/node";
import UserController from "~/controllers/UserController";

export const loader: LoaderFunction = async ({ request }) => {
  const userAuthController = await new UserController(request);
  return await userAuthController.logout();
};
