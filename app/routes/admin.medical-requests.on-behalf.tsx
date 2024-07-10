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
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { EditIcon } from "~/components/icons/Edit";
import { PlusIcon } from "~/components/icons/Plus";
import { SearchIcon } from "~/components/icons/Search";
import CreateRecordModal from "~/components/modals/CreateRecord";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomSelect from "~/components/ui/inputs/select";
import CustomTextarea from "~/components/ui/inputs/textarea";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import UserController from "~/controllers/UserController";
import {
  deptTableCols,
  onBehalfRequestTableCols,
  userTableCols,
} from "~/data/table-cols";
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

  // loader data
  const { medicalRequests, totalPages } = useLoaderData<{
    medicalRequests: MedicalRequestInterface[];
    totalPages: number;
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
      <CustomTable
        columns={onBehalfRequestTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={() => {}}
        totalPages={totalPages}
      >
        {medicalRequests?.map((medicalRequest) => (
          <TableRow key={medicalRequest._id}>
            <TableCell>
              {moment(medicalRequest.createdAt).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell className="text-sm">
              {medicalRequest.requestedFor && (
                <User
                  avatarProps={{
                    radius: "sm",
                    className: "dark:bg-slate-700",
                    showFallback: true,
                    name: getInitials(
                      medicalRequest?.requestedFor?.firstName +
                        " " +
                        medicalRequest?.requestedFor?.lastName
                    ),
                    size: "sm",
                  }}
                  name={
                    <p className="font-semibold text-xs">
                      {medicalRequest?.requestedFor?.firstName +
                        " " +
                        medicalRequest?.requestedFor?.lastName}
                    </p>
                  }
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

  const medRequestController = new MedicalRequestController(request);
  const departmentController = new DepartmentController(request);

  const { departments } = await departmentController.getDepartments({
    page: 1,
    search_term: "",
  });

  const { medicalRequests, totalPages } =
    await medRequestController.getRequestsMadeByUserForOthers({
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
