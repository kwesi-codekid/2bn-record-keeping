import { Calendar } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getGreeting } from "~/components/cards/greeting";
import { Card, IconCard } from "~/components/sections/cards";
import DashboardController from "~/controllers/DashboardController";
import UserController from "~/controllers/UserController";
import { UserInterface } from "~/utils/types";
import { today, getLocalTimeZone } from "@internationalized/date";


export default function AdminDashboard() {
  const [greeting, setGreeting] = useState<any>()
  useEffect(() => {
    setGreeting(getGreeting())
  }, [])
  const { total, users } = useLoaderData<{
    total: {
      userTotal: number,
      departmentTotal: number,
      companyTotal: number,
      groupTotal: number,
      missionTotal:number
    },
    users: UserInterface
  }>();


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
              <p className="font-nunito text-2xl font-semibold">{total.userTotal}</p>
            </IconCard>
            <IconCard title="Total Mission">
              <p className="font-nunito text-2xl font-semibold">{total.missionTotal}</p>
            </IconCard>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <IconCard title="Total Companies">
              <p className="font-nunito text-2xl font-semibold">{total.companyTotal}</p>
            </IconCard>
            <IconCard title="Total Department">
              <p className="font-nunito text-2xl font-semibold">{total.departmentTotal}</p>
            </IconCard>
            <IconCard title="Total Companies">
              <p className="font-nunito text-2xl font-semibold">{total.groupTotal}</p>
            </IconCard>
          </div>
        </div>

        {/* chart */}
        <Card title="Analytics" />
      </div>

      {/* right-sided cards */}
      <div className="flex flex-col gap-6 h-full">
        <Card title="" >
          <p className='font-montserrat font-semibold text-4xl'>{greeting}</p>
        </Card>
        <Card  title="" >
          <Calendar
            aria-label="Date (Read Only)"
            value={today(getLocalTimeZone())}
            isReadOnly
            classNames={{
              headerWrapper: "dark:bg-slate-950",
              header: "dark:bg-slate-950",
              content: "dark:bg-slate-950 w-[23vw] overflow-x-hidden border border-white/5 shadow-md"
            }}
          />
        </Card>
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const dashboardController = new DashboardController(request);
  const usersController = new UserController(request);

  const users = await usersController.getUsers({ page, search_term, })

  const total = await dashboardController.totals()
  return { total, users }
};
