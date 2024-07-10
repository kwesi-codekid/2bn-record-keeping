import {
  Button,
  Card,
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
  useLocation,
  useNavigate,
  useNavigation,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "~/components/icons/ArrowLeft";
import { PlusIcon } from "~/components/icons/Plus";
import ReloadIcon from "~/components/icons/Reload";
import { SearchIcon } from "~/components/icons/Search";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import VisitController from "~/controllers/VisitController";
import { visitDetailsTabs } from "~/data/nav-links";
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
  VitalInterface,
} from "~/utils/types";

const AdminDepartments = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { visit_id, visit_details } = useParams();

  // loader data
  const { visit, vital } = useLoaderData<{
    visit: VisitInterface;
    vital: VitalInterface;
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
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {visitDetailsTabs.map((tab) => (
            <Button
              key={tab.label}
              variant={`${
                pathname ===
                "/admin/visits/" + visit_id + "/" + visit_details + tab.path
                  ? "flat"
                  : "light"
              }`}
              color="primary"
              size="sm"
              className="font-nunito"
              onPress={() =>
                navigate(
                  `/admin/visits/${visit_id}/${visit_details}${tab.path}`
                )
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <Button
          variant="flat"
          color="danger"
          size="sm"
          className="font-nunito font-medium"
          onPress={() => navigate(`/admin/visits/${visit_id}`)}
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="size-5"
            >
              <path
                fill="currentColor"
                d="M15.596 14.204V9.799q0-.276-.252-.382t-.449.092l-1.931 1.932q-.237.236-.237.559t.242.566l1.927 1.926q.196.197.448.096t.252-.384M5.616 20q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h12.77q.666 0 1.14.475T20 5.615v12.77q0 .666-.475 1.14t-1.14.475zM9 19h9.385q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H9z"
              ></path>
            </svg>
          }
        >
          Close
        </Button>
      </div>

      <Outlet context={{ vital }} />

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

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const { visit_id, visit_details } = params;

  const visitController = new VisitController(request);

  const visit = await visitController.getVisitById(visit_id as string);
  const vital = await visitController.getVitalDetails({
    visitId: visit_id as string,
    visitRecordId: visit_details as string,
  });

  return {
    visit,
    vital,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Visits - Medical Requests | Adamus Med Treatment" },
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
