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
  useOutletContext,
} from "@remix-run/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { EditIcon } from "~/components/icons/Edit";
import { PlusIcon } from "~/components/icons/Plus";
import { SearchIcon } from "~/components/icons/Search";
import ConfirmModal from "~/components/modals/ConfirmModal";
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
  approvalsTableCols,
  deptTableCols,
  personalRequestTableCols,
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
  const { unapprovedRequests } = useLoaderData<{
    unapprovedRequests: MedicalRequestInterface[];
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
      approveDisclosure.onClose();
      declineDisclosure.onClose();
      successToast("Success!", actionData.message);
      navigate(".", { replace: true });
    }
  }, [actionData]);

  // approval
  const approveDisclosure = useDisclosure();
  const [approvalId, setApprovalId] = useState<string>("");
  useEffect(() => {
    if (!approveDisclosure.isOpen) setApprovalId("");
  }, [approveDisclosure.onOpenChange]);

  // decline
  const declineDisclosure = useDisclosure();
  const [declineId, setDeclineId] = useState<string>("");
  useEffect(() => {
    if (!declineDisclosure.isOpen) setDeclineId("");
  }, [declineDisclosure.onOpenChange]);

  return (
    <div className="h-full flex flex-col gap-2">
      <CustomTable
        columns={approvalsTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={() => {}}
        totalPages={1}
      >
        {unapprovedRequests?.map((medicalRequest) => (
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
            <TableCell>{medicalRequest.requestedFor?.phone}</TableCell>
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
            <TableCell className="flex items-center">
              <Button
                size="sm"
                color="success"
                variant="light"
                onPress={() => {
                  approveDisclosure.onOpen();
                  setApprovalId(medicalRequest._id);
                }}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => {
                  declineDisclosure.onOpen();
                  setDeclineId(medicalRequest._id);
                }}
              >
                Decline
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      {/* approve request */}
      <ConfirmModal
        title="Approve Medical Request"
        isModalOpen={approveDisclosure.isOpen}
        onCloseModal={approveDisclosure.onClose}
        actionText="Confirm Approval"
        intent="approve-request"
        color="success"
      >
        <CustomInput
          name="_id"
          label="Approval ID"
          value={approvalId}
          hidden={true}
        />
        <p className="font-nunito text-slate-800 dark:text-white">
          Are you sure to approve this request?
        </p>
      </ConfirmModal>

      {/* decline request */}
      <ConfirmModal
        title="Decline Medical Request"
        isModalOpen={declineDisclosure.isOpen}
        onCloseModal={declineDisclosure.onClose}
        actionText="Confirm Decline"
        intent="decline-request"
        color="danger"
      >
        <CustomInput
          name="_id"
          label="Decline ID"
          value={declineId}
          hidden={true}
        />
        <p className="font-nunito text-slate-800 dark:text-white">
          Are you sure to decline this request?
        </p>
      </ConfirmModal>
    </div>
  );
};

export default AdminDepartments;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const medRequestController = new MedicalRequestController(request);

  if (formValues.intent === "approve-request") {
    const response = await medRequestController.approveMedicalRequest({
      _id: formValues._id as string,
    });

    return response;
  }

  if (formValues.intent === "decline-request") {
    const response = await medRequestController.declineMedicalRequest({
      _id: formValues._id as string,
    });

    return response;
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const medRequestsController = new MedicalRequestController(request);

  const unapprovedRequests =
    await medRequestsController.getUnapprovedRequests();
  return {
    unapprovedRequests,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Approvals | Medical Requests | Adamus Med Treatment" },
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
