import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, IconCard } from "~/components/sections/cards";
import CompanyController from "~/controllers/CompanyController";
import DepartmentController from "~/controllers/DepartmentController";
import UserController from "~/controllers/UserController";

export default function AdminDashboard() {
  const { totalUsers, totalDepartmentsCount, totalCompanies } = useLoaderData<{ totalUsers: number; totalDepartmentsCount: number; totalCompanies: number }>();
  console.log(totalUsers, totalDepartmentsCount, totalCompanies);

  const data = [
    { title: "Total Members", value: 12 },
    { title: "Total Tickets", value: 12 },
    { title: "Total Stats", value: 12 },
  ];

  return (
    <div className="h-full grid grid-cols-3 gap-8">
      {/* left-sided cards */}
      <div className="col-span-2 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {/* stats card */}
          <div className="grid grid-cols-2 gap-4">
            <IconCard title="Total Staff">
              <p className="font-nunito text-2xl font-semibold">{totalUsers}</p>
            </IconCard>
            <IconCard title="Total Departments">
              <p className="font-nunito text-2xl font-semibold">{totalDepartmentsCount}</p>
            </IconCard>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <IconCard title="Total Companies">
              <p className="font-nunito text-2xl font-semibold">{totalCompanies}</p>
            </IconCard>
             <IconCard title="Total Companies">
              <p className="font-nunito text-2xl font-semibold">{totalCompanies}</p>
            </IconCard>
             <IconCard title="Total Companies">
              <p className="font-nunito text-2xl font-semibold">{totalCompanies}</p>
            </IconCard>
          </div>
        </div>

        {/* chart */}
        <Card title="Analytics" />
      </div>

      {/* right-sided cards */}
      <div className="flex flex-col gap-6 h-full">
        <Card title="Recents" />
        <Card title="Recents" />
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const userController = new UserController(request);
  const departmentController = new DepartmentController(request);
  const companyController = new CompanyController(request);

  const userResult = await userController.getUsers({ page, search_term });
  const departmentResult = await departmentController.getDepartments({ page, search_term });
  const companyResult = await companyController.getCompanys({ page, search_term });

  return {
    totalUsers: userResult.totalPages,         // Adjusted property names
    totalDepartmentsCount: departmentResult.totalPages, // Adjusted property names
    totalCompanies: companyResult.totalPages   // Adjusted property names
  };
};
