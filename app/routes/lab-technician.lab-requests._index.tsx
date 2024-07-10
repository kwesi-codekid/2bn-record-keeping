import {
  Button,
  TableCell,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import moment from "moment";
import { useEffect, useState } from "react";
import BellRingingIcon from "~/components/icons/BellRinging";
import MicroscopeIcon from "~/components/icons/Microscope";
import CreateRecordModal from "~/components/modals/CreateRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomTable from "~/components/ui/new-table";
import VisitController from "~/controllers/VisitController";
import { labRequestTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { VisitInterface } from "~/utils/types";

const PendingLabRequests = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // loader data
  const { labRequests } = useLoaderData<{
    labRequests: {
      _id: string;
      visit: VisitInterface;
      labTests: {
        test: string;
        result: string;
      }[];
      status: string;
      createdAt: string;
    }[];
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
      successToast("Success!", actionData.message);
    }
    createDisclosure.onClose();
    navigate("/lab-technician/lab-requests", { replace: true });
  }, [actionData]);

  //   create results stuff
  const createDisclosure = useDisclosure();
  const [selectedLabRequest, setSelectedLabRequest] = useState<{
    _id: string;
    visit: VisitInterface;
    labTests: {
      test: string;
      result: string;
    }[];
    status: string;
    createdAt: string;
  } | null>(null);
  useEffect(() => {
    if (!createDisclosure.isOpen) {
      setSelectedLabRequest(null);
    }
  }, [createDisclosure.onOpenChange]);

  return (
    <div className="flex-1 overflow-y-auto vertical-scrollbar">
      <CustomTable
        columns={labRequestTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={() => {}}
        totalPages={1}
      >
        {labRequests.map((labRequest, index: number) => (
          <TableRow key={index}>
            <TableCell className="text-sm">
              {moment(labRequest.createdAt).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell>
              <User
                avatarProps={{
                  radius: "sm",
                  className: "dark:bg-slate-700",
                  showFallback: true,
                  name: getInitials(
                    labRequest?.visit?.staff?.firstName +
                      " " +
                      labRequest?.visit?.staff?.lastName
                  ),
                  size: "sm",
                }}
                name={
                  <p className="font-semibold text-sm">
                    {labRequest?.visit?.staff?.firstName +
                      " " +
                      labRequest?.visit?.staff?.lastName}
                  </p>
                }
              />
            </TableCell>
            <TableCell className="text-sm">
              {labRequest?.visit?.staff?.phone}
            </TableCell>
            <TableCell className="text-sm">
              {labRequest?.visit?.staff?.email}
            </TableCell>
            <TableCell className="text-sm">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="font-nunito"
                  variant="flat"
                  startContent={<BellRingingIcon className="size-4" />}
                  color="warning"
                >
                  Notify Staff
                </Button>
                <Button
                  size="sm"
                  className="font-nunito"
                  variant="flat"
                  color="success"
                  startContent={<MicroscopeIcon className="size-4" />}
                  onPress={() => {
                    setSelectedLabRequest(labRequest as any);
                    createDisclosure.onOpen();
                  }}
                >
                  Add Results
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      <CreateRecordModal
        isOpen={createDisclosure.isOpen}
        onOpenChange={createDisclosure.onOpenChange}
        onCloseModal={createDisclosure.onClose}
        title="Add Lab Results"
        actionText="Save Results"
        intent="add-lab-results"
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          {selectedLabRequest?.labTests.map((labTest, index) => (
            <CustomInput label={labTest.test} name={labTest.test} key={index} />
          ))}
          <CustomInput
            label="Lab ID"
            name="labId"
            value={selectedLabRequest?._id}
            hidden={true}
          />
        </div>
      </CreateRecordModal>
    </div>
  );
};

export default PendingLabRequests;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  // create an empty array to hold the lab results
  let labResults: { test: string; result: string }[] = [];

  for (const key in formValues) {
    if (key !== "labId" && key !== "intent") {
      labResults.push({ test: key, result: formValues[key] as string });
    }
  }

  const visitController = new VisitController(request);
  const response = await visitController.saveLabResult({
    labId: formValues.labId as string,
    labTests: labResults,
  });

  console.log(response);

  return response;
};

export const loader: LoaderFunction = async ({ request }) => {
  const visitController = new VisitController(request);
  const labRequests = await visitController.getAllLabRequestsByStatus(
    "pending"
  );

  console.log({ labRequests });

  return {
    labRequests,
  };
};
