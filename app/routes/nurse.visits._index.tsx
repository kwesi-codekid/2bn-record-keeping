import { Button, Input, TableCell, TableRow, User } from "@nextui-org/react";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import moment from "moment";
import ReloadIcon from "~/components/icons/Reload";
import { SearchIcon } from "~/components/icons/Search";
import CustomTable from "~/components/ui/new-table";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import { clinicalVisitTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { VisitInterface } from "~/utils/types";

const NurseMedicalRequestsIndex = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // loader data
  const { visits, totalPages } = useLoaderData<{
    visits: VisitInterface[];
    totalPages: number;
  }>();

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex justify-between gap-3 items-center">
        <Input
          isClearable
          placeholder="Search here..."
          radius="md"
          startContent={<SearchIcon />}
          className="w-full md:w-1/4"
          classNames={{
            inputWrapper: "bg-white dark:bg-slate-700",
          }}
          onValueChange={(value) => {
            const timeoutId = setTimeout(() => {
              navigate(`?search_term=${value}`);
            }, 1500);
            return () => clearTimeout(timeoutId);
          }}
        />
        <div className="flex gap-3">
          <Button
            color="primary"
            variant="flat"
            size="sm"
            radius="md"
            startContent={
              <ReloadIcon
                className={`size-5 ${
                  navigation.state === "loading" && "animate-spin"
                }`}
              />
            }
            className="font-montserrat font-semibold"
            onPress={() => navigate("/nurse/visits")}
          >
            Reload Data
          </Button>
        </div>
      </div>
      <CustomTable
        columns={clinicalVisitTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={() => {}}
        totalPages={totalPages}
      >
        {visits?.map((visit) => (
          <TableRow key={visit._id}>
            <TableCell>
              {moment(visit.createdAt).format("DD-MM-YYYY hh:mm")}
            </TableCell>

            <TableCell className="text-sm">
              <User
                avatarProps={{
                  radius: "sm",
                  className: "dark:bg-slate-700",
                  showFallback: true,
                  name: getInitials(
                    visit?.staff?.firstName + " " + visit?.staff?.lastName
                  ),
                  size: "sm",
                }}
                name={
                  <p className="font-semibold text-xs">
                    {visit?.staff?.firstName + " " + visit?.staff?.lastName}
                  </p>
                }
              />
            </TableCell>
            <TableCell>{visit.staff?.phone}</TableCell>
            <TableCell className="text-sm">{visit.requestType}</TableCell>
            <TableCell className="flex items-center">
              <Button
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="size-5"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    >
                      <path d="M6 4H5a2 2 0 0 0-2 2v3.5h0a5.5 5.5 0 0 0 11 0V6a2 2 0 0 0-2-2h-1"></path>
                      <path d="M8 15a6 6 0 1 0 12 0v-3m-9-9v2M6 3v2"></path>
                      <path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path>
                    </g>
                  </svg>
                }
                size="sm"
                color="success"
                variant="flat"
                onPress={() => navigate(`/nurse/visits/${visit._id}`)}
              >
                Treatment Info
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </div>
  );
};

export default NurseMedicalRequestsIndex;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const medRequestsController = new MedicalRequestController(request);

  const { visits, totalPages } =
    await medRequestsController.getApprovedRequests({
      page,
      search_term,
    });

  return {
    visits,
    totalPages,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Medical Requests | Adamus Med Treatment" },
    {
      name: "description",
      content: ".",
    },
    {
      name: "author",
      content: "KwaminaWhyte",
    },
    {
      name: "author",
      content: "Codekid",
    },
    { name: "og:title", content: "Adamus Med Treatment" },
    {
      name: "og:description",
      content: "",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1701282976/qfdbysyu0wqeugtcq9wq.jpg",
    },
    { name: "og:url", content: "https://marry-right.vercel.app" },
    {
      name: "keywords",
      content:
        "legal marriages in Ghana, Pastors to bless marriages, Is he/she married?, marriiage under ordinance, cases related to marriages in Ghana, mohammedans, ordinance, traditional, verify my marriage certificate, churches legally certified to bless marriages",
    },
  ];
};
