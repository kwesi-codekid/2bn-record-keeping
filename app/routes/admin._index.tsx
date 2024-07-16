import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, IconCard } from "~/components/sections/cards";
import DepartmentController from "~/controllers/DepartmentController";
import UserController from "~/controllers/UserController";

export default function AdminDashboard() {
  const {totalPages,totalDepartmentsCount} = useLoaderData<{totalPages:number,totalDepartmentsCount:number}>()
  console.log(totalPages);
  
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
              <IconCard  title="Total Staff">
                <p className="font-nunito text-2xl font-semibold">
                  {totalPages}
                </p>
              </IconCard>
              <IconCard  title="Total Departments">
                <p className="font-nunito text-2xl font-semibold">
                  {totalDepartmentsCount}
                </p>
              </IconCard>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {data.map((data, index) => (
              <IconCard key={index} title={data.title}>
                <p className="font-nunito text-2xl font-semibold">
                  {data.value}
                </p>
              </IconCard>
            ))}
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
  const userController = new UserController(request)
  const departmentController = new DepartmentController(request)

  const {totalPages} = await userController.getUsers({
    page,
    search_term,
  })
  const {totalDepartmentsCount} = await departmentController.getDepartments({
    page,
    search_term,
  })

  return {totalPages, totalDepartmentsCount}
}
