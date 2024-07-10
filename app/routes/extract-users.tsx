import { Button, Input } from "@nextui-org/react";
import { ActionFunction, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";
import ExcelReader from "~/components/excel-reader";
import CustomFileInput2 from "~/components/ui/controlled-file-input";
import UserController from "~/controllers/UserController";
import User from "~/models/User";

const AdminDepartments = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <ExcelReader />
    </div>
  );
};

export default AdminDepartments;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const field = formData.get("fiels");

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const department = url.searchParams.get("department") as string;
  const role = url.searchParams.get("role") as string;

  await User.create({});

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
