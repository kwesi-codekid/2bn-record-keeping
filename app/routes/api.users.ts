import { LoaderFunction, json } from "@remix-run/node";
import UserController from "~/controllers/UserController";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const department = url.searchParams.get("department") as string;
  const role = url.searchParams.get("role") as string;

  const userController = new UserController(request);
  const { users, totalPages } = await userController.getUsersByDepartment({
    search_term,
    page,
    limit: 50,
    department,
    role,
  });

  return {
    users,
    totalPages,
  };
};
