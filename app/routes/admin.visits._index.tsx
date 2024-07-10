import {
  Button,
  Chip,
  Input,
  TableCell,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { PlusIcon } from "~/components/icons/Plus";
import ReloadIcon from "~/components/icons/Reload";
import { SearchIcon } from "~/components/icons/Search";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import {
  clinicalVisitTableCols,
  personalRequestTableCols,
} from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import {
  DepartmentInterface,
  MedicalRequestInterface,
  UserInterface,
  VisitInterface,
} from "~/utils/types";

const AdminDepartments = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // outlet context
  const { user } = useOutletContext<{
    user: UserInterface;
  }>();

  // loader data
  const { visits, totalPages, departments } = useLoaderData<{
    visits: VisitInterface[];
    totalPages: number;
    departments: DepartmentInterface[];
  }>();

  // action data
  const actionData = useActionData<{
    status: string;
    message: string;
    errors: [{ field: string; message: string }];
  }>();
  useEffect(() => {
    if (actionData?.status === "error") {
      errorToast("Error!", actionData.message);
    }
    if (actionData?.status === "success") {
      deleteDisclosure.onClose();
      successToast("Success!", actionData.message);
      navigate(".", { replace: true });
    }
  }, [actionData]);

  // delete department modal
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState<string>("");
  useEffect(() => {
    if (!deleteDisclosure.isOpen) setDeleteId("");
  }, [deleteDisclosure.onOpenChange]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex justify-between gap-3 items-center">
        <Input
          isClearable
          placeholder="Search here..."
          size="sm"
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
            onPress={() => navigate("/admin/visits")}
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
              {moment(visit.createdAt).format("DD-MM-YYYY")}
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
                onPress={() => navigate(`/admin/visits/${visit._id}`)}
              >
                Treatment Info
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      <DeleteRecordModal
        title="Delete Medical Request"
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
      >
        <CustomInput hidden={true} label="ID" name="_id" value={deleteId} />
        <p className="font-nunito text-slate-800 dark:text-white">
          Are you sure you want to delete this medical request?
        </p>
      </DeleteRecordModal>
    </div>
  );
};

export default AdminDepartments;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const medRequestController = new MedicalRequestController(request);

  if (formValues.intent === "delete") {
    return await medRequestController.deleteMedicalRequest(
      formValues._id as string
    );
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const medRequestsController = new MedicalRequestController(request);
  const departmentController = new DepartmentController(request);

  const { departments } = await departmentController.getDepartments({
    page: 1,
    search_term: "",
  });

  const { visits, totalPages } =
    await medRequestsController.getApprovedRequests({
      page,
      search_term,
    });

  return {
    visits,
    departments,
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
