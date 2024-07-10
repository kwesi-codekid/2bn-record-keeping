import { LoaderFunction, json } from "@remix-run/node";
import UserController from "~/controllers/UserController";
import Department from "~/models/Department";
import User from "~/models/User";

export const loader: LoaderFunction = async ({ request }) => {
  // Fetch all departments and create a mapping of rowDepartment to _id
  const departments = await Department.find();
  const departmentMap = departments.reduce((map, dept) => {
    map[dept.name] = dept._id;
    return map;
  }, {});

  // Fetch all users who have a rowDepartment value
  const users = await User.find({
    rowDepartment: { $exists: true, $ne: null },
  });

  // Iterate over users and update the department field
  // for (let user of users) {
  //   const departmentId = departmentMap[user.rowDepartment];
  //   if (departmentId) {
  //     user.department = departmentId;
  //     await user.save();
  //   } else {
  //     console.log(
  //       `Department not found for user: ${user._id}, rowDepartment: ${user.rowDepartment}`
  //     );
  //   }
  // }

  return {
    departments,
  };
};
