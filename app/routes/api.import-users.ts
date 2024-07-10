import { ActionFunction } from "@remix-run/node";
import UserController from "~/controllers/UserController";
import User from "~/models/User";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const staffId = formData.get("staffId") as string;
  const phone = formData.get("phone") as string;
  const rowDepartment = formData.get("rowDepartment") as string;
  const rowApprovedBy = formData.get("rowApprovedBy") as string;

  await User.create({
    firstName,
    lastName,
    staffId,
    phone,
    rowApprovedBy,
    rowDepartment,
  });

  return {};
};
