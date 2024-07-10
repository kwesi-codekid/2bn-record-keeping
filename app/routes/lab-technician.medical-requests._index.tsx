import {
  Button,
  Chip,
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
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import { personalRequestTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import {
  DepartmentInterface,
  MedicalRequestInterface,
  UserInterface,
} from "~/utils/types";

const AdminDepartments = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // outlet context
  const { user } = useOutletContext<{
    user: UserInterface;
  }>();

  // loader data
  const { medicalRequests, totalPages, departments } = useLoaderData<{
    medicalRequests: MedicalRequestInterface[];
    totalPages: number;
    departments: DepartmentInterface[];
  }>();

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
      navigate("/staff/medical-requests", { replace: true });
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
      <CustomTable
        columns={personalRequestTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={() => {}}
        totalPages={totalPages}
      >
        {medicalRequests?.map((medicalRequest) => (
          <TableRow key={medicalRequest._id}>
            <TableCell>
              {moment(medicalRequest.createdAt).format("DD-MM-YYYY hh:mm")}
            </TableCell>

            <TableCell className="text-sm">
              {medicalRequest.requestedBy._id !== user._id ? (
                <User
                  avatarProps={{
                    radius: "sm",
                    className: "dark:bg-slate-700",
                    showFallback: true,
                    name: getInitials(
                      medicalRequest?.requestedBy?.firstName +
                        " " +
                        medicalRequest?.requestedBy?.lastName
                    ),
                    size: "sm",
                  }}
                  name={
                    <p className="font-semibold text-xs">
                      {medicalRequest?.requestedBy?.firstName +
                        " " +
                        medicalRequest?.requestedBy?.lastName}
                    </p>
                  }
                />
              ) : (
                <User
                  avatarProps={{
                    radius: "full",
                    className: "dark:bg-slate-700 bg-slate-400/20",
                    showFallback: true,
                    fallback: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 32 32"
                        className="size-5 text-slate-800 dark:text-white"
                      >
                        <path
                          fill="none"
                          d="M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0M20.5 12.5A4.5 4.5 0 1 1 16 8a4.5 4.5 0 0 1 4.5 4.5"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M26.749 24.93A13.99 13.99 0 1 0 2 16a13.9 13.9 0 0 0 3.251 8.93l-.02.017c.07.084.15.156.222.239c.09.103.187.2.28.3q.418.457.87.87q.14.124.28.242q.48.415.99.782c.044.03.084.069.128.1v-.012a13.9 13.9 0 0 0 16 0v.012c.044-.031.083-.07.128-.1q.51-.368.99-.782q.14-.119.28-.242q.451-.413.87-.87c.093-.1.189-.197.28-.3c.071-.083.152-.155.222-.24ZM16 8a4.5 4.5 0 1 1-4.5 4.5A4.5 4.5 0 0 1 16 8M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0"
                        ></path>
                      </svg>
                    ),
                    size: "sm",
                  }}
                  name={<p className="font-nunito text-sm">You</p>}
                />
              )}
            </TableCell>

            <TableCell>{medicalRequest.initialComplaint}</TableCell>
            <TableCell>
              <Chip
                className="capitalize"
                variant="flat"
                size="sm"
                color={`${
                  medicalRequest.status === "pending"
                    ? "primary"
                    : medicalRequest.status === "approved"
                    ? "success"
                    : "danger"
                }`}
              >
                {medicalRequest.status}
              </Chip>
            </TableCell>
            <TableCell className="text-sm">
              {medicalRequest.status === "approved" ? (
                <User
                  avatarProps={{
                    radius: "sm",
                    className: "dark:bg-slate-700",
                    showFallback: true,
                    name: getInitials(
                      medicalRequest?.approvedBy?.firstName +
                        " " +
                        medicalRequest?.approvedBy?.lastName
                    ),
                    size: "sm",
                  }}
                  name={
                    <p className="font-semibold text-xs">
                      {medicalRequest?.approvedBy?.firstName +
                        " " +
                        medicalRequest?.approvedBy?.lastName}
                    </p>
                  }
                />
              ) : medicalRequest.status === "declined" ? (
                <User
                  avatarProps={{
                    radius: "sm",
                    className: "dark:bg-slate-700",
                    showFallback: true,
                    name: getInitials(
                      medicalRequest?.declinedBy?.firstName +
                        " " +
                        medicalRequest?.declinedBy?.lastName
                    ),
                    size: "sm",
                  }}
                  name={
                    <p className="font-semibold text-xs">
                      {medicalRequest?.declinedBy?.firstName +
                        " " +
                        medicalRequest?.declinedBy?.lastName}
                    </p>
                  }
                />
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>
              {medicalRequest.approvedAt
                ? new Date(medicalRequest.approvedAt).toLocaleDateString()
                : "N/A"}
            </TableCell>
            <TableCell className="flex items-center">
              <Button size="sm" color="success" variant="light">
                View
              </Button>
              <Button size="sm" color="primary" variant="light">
                Edit
              </Button>
              {medicalRequest.status === "pending" && (
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    deleteDisclosure.onOpen();
                    setDeleteId(medicalRequest._id);
                  }}
                >
                  Delete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      <DeleteRecordModal
        title="Delete Medical Request"
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        action="/staff/medical-requests"
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

  const { medicalRequests, totalPages } =
    await medRequestsController.getPersonalMedicalRequests({
      page,
      search_term,
    });

  return {
    medicalRequests,
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
