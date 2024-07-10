import {
  Button,
  TableCell,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import moment from "moment";
import { useEffect, useState } from "react";
import MicroscopeIcon from "~/components/icons/Microscope";
import CreateRecordModal from "~/components/modals/CreateRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomTable from "~/components/ui/new-table";
import VisitController from "~/controllers/VisitController";
import { labRequestTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { VisitInterface } from "~/utils/types";

const CompletedLabRequests = () => {
  const navigation = useNavigation();
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
              {labRequest.visit.staff?.phone}
            </TableCell>
            <TableCell className="text-sm">
              {labRequest.visit.staff.email}
            </TableCell>
            <TableCell className="text-sm">
              <div className="flex items-center gap-3">
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
                  Edit Results
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
        </div>
      </CreateRecordModal>
    </div>
  );
};

export default CompletedLabRequests;

export const loader: LoaderFunction = async ({ request }) => {
  const visitController = new VisitController(request);
  const labRequests = await visitController.getAllLabRequestsByStatus(
    "completed"
  );

  console.log({ labRequests });

  return {
    labRequests,
  };
};
