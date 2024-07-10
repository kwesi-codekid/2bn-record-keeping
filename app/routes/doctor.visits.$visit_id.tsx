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
import { calculateAge, getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import {
  DepartmentInterface,
  MedicalRequestInterface,
  UserInterface,
  VisitInterface,
} from "~/utils/types";
import avatar from "~/assets/illustrations/avatar.jpg";
import moment from "moment";

const AdminDepartments = () => {
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const { visit_details } = useParams();
  const navigate = useNavigate();

  // loader data
  const { visit, visit_id } = useLoaderData<{
    visit: VisitInterface;
    visit_id: string;
    // visit_details: string;
  }>();

  // visit record id
  const visitDetail = pathname.split("/").pop();
  const [visitRecordId, setVisitRecordId] = useState<string>();
  useEffect(() => {
    console.log(visitDetail);

    if (navigation.state === "idle") setVisitRecordId(visitDetail);
  }, [navigation]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* visit lists */}
        <div className="h-full flex flex-col gap-4">
          <Button
            className="flex items-center gap-2 w-max font-nunito"
            startContent={<ArrowLeftIcon className="size-5" />}
            variant="light"
            color="primary"
            onClick={() => navigate("/doctor/visits")}
          >
            Back to Visits
          </Button>

          {/* staff info */}
          {/* staff info */}
          <Card className="flex flex-col gap-3 py-5 px-4 rounded-3xl dark:bg-slate-900/80 bg-white shadow-none">
            <div className="flex items-start gap-3">
              <div className="rounded-full">
                <img
                  src={avatar}
                  alt="avatar"
                  className="size-20 rounded-full"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-montserrat font-semibold text-2xl mb-2">
                  {visit.staff.firstName} {visit.staff.lastName}
                </h3>
                <p className="text-xs font-nunito flex items-center justify-between">
                  <span className="font-montserrat font-semibold text-slate-600 dark:text-slate-300">
                    Staff ID
                  </span>
                  {visit.staff.staffId}
                </p>
                <p className="text-xs font-nunito flex items-center justify-between">
                  <span className="font-montserrat font-semibold text-slate-600 dark:text-slate-300">
                    Email
                  </span>
                  {visit.staff.email}
                </p>
                <p className="text-xs font-nunito flex items-center justify-between">
                  <span className="font-montserrat font-semibold text-slate-600 dark:text-slate-300">
                    Phone
                  </span>
                  {visit.staff?.phone}
                </p>
                <p className="text-xs font-nunito flex items-center justify-between">
                  <span className="font-montserrat font-semibold text-slate-600 dark:text-slate-300">
                    Age
                  </span>
                  {
                    // check if calculated age is not a number
                    isNaN(calculateAge(visit.staff?.dateOfBirth as string))
                      ? "N/A"
                      : calculateAge(visit.staff?.dateOfBirth as string)
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* visits */}
          <Card className="flex flex-col gap-3 p-4 rounded-3xl dark:bg-slate-900/80 bg-white shadow-none flex-1 overflow-y-auto">
            <h3 className="font-montserrat text-lg font-semibold">Visits</h3>

            <div>
              <div className="flex items-center justify-between rounded-xl dark:bg-slate-950/70 bg-slate-400/30 py-2 px-3">
                <div className="w-1/3">
                  <h4 className="text-sm  font-medium font-montserrat">Date</h4>
                </div>
                <div className="w-[30%]">
                  <h4 className="text-sm  font-medium font-montserrat">
                    Visit Type
                  </h4>
                </div>
                <div className="w-[20%]">
                  <h4 className="text-sm  font-medium font-montserrat">
                    Action
                  </h4>
                </div>
              </div>
              {visit.visitRecords.map((visit: any) => (
                <div
                  className={`flex items-center justify-between rounded-xl py-1 px-3  mt-1 ${
                    visit._id === visit_details ? "bg-blue-400/10" : ""
                  }`}
                  key={visit._id}
                >
                  <div className="w-1/3">
                    <p className="text-xs font-nunito">
                      {moment(visit.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </div>
                  <div className="w-[30%]">
                    <p className="text-xs font-nunito">{visit.visitType}</p>
                  </div>
                  <div className="w-[20%] flex items-center">
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      className="font-nunito"
                      onPress={() =>
                        navigate(`/doctor/visits/${visit_id}/${visit?._id}`)
                      }
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* visit details */}
        <div className="md:col-span-2">
          <Outlet />
        </div>
      </div>

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

  return {
    visit,
    visit_id,
    visit_details,
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
