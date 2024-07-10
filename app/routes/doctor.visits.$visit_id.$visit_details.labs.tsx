import {
  AutocompleteItem,
  Button,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import ConfirmModal from "~/components/modals/ConfirmModal";
import CustomComboBox from "~/components/ui/inputs/combobox";
import CustomInput from "~/components/ui/inputs/input";
import VisitController from "~/controllers/VisitController";
import { labTests } from "~/data/select-items";
import { errorToast, successToast } from "~/utils/toasters";
import { SelectItemInterface, SelectItemsInterface } from "~/utils/types";

const Vitals = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { visit_id, visit_details } = useParams();

  // loader data
  const { labDetails } = useLoaderData<{
    labDetails: {
      labTests: [{ test: string; result: string }];
    };
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
      confirmDisclosure.onClose();
      navigate(`/doctor/visits/${visit_id}/${visit_details}/labs`, {
        replace: true,
      });
    }
  }, [actionData]);

  // lab request stuff
  const [labs, setLabs] = useState<SelectItemsInterface>(labTests);
  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [otherTest, setOtherTest] = useState<string>("");
  const addToSelectedLabs = (lab: any) => {
    // set selected labs and remove from labs
    setSelectedLabs([...selectedLabs, lab]);
  };
  const addOtherTestToSelected = (test: string) => {
    setSelectedLabs([...selectedLabs, test]);
  };
  const removeFromSelectedLabs = (lab: string) => {
    // remove from selected labs and add to labs
    setSelectedLabs(selectedLabs.filter((selectedLab) => selectedLab !== lab));

    // add back to labs
    // use the key to find the lab object
    const labObject = labTests.find((labTest) => labTest.key === lab);
    if (labObject) {
      setLabs([...labs, labObject]);
    }
  };

  useEffect(() => {
    setSelectedLab(null);
    // filter out selected lab from labs
    // for each of the labs, return the ones whose key is not found in selectedLabs
    const filteredLabs = labs.filter((lab) => {
      return !selectedLabs.includes(lab.key);
    });

    setLabs(filteredLabs);
  }, [selectedLabs]);

  const confirmDisclosure = useDisclosure();

  return (
    <div className="h-full md:h-[82vh] flex flex-col gap-4 md:gap-8 pt-3 bg-white dark:bg-slate-900/80 rounded-3xl px-4 md:px-5 overflow-y-auto vertical-scrollbar pb-5">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat font-semibold text-xl">
          Laboratory Requests
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* begin:: lab tests */}
        {labDetails ? (
          <div className="flex flex-col gap-5">
            <h3 className="font-montserrat text-slate-700 dark:text-slate-300 font-semibold text-lg">
              Requested Labs
            </h3>
            <div className="flex flex-wrap gap-3">
              {labDetails.labTests.length > 0 &&
                labDetails.labTests.map(
                  (lab: { test: string; result: string }) => (
                    <Chip
                      variant="flat"
                      size="lg"
                      color="success"
                      className="font-nunito uppercase"
                      key={lab.test}
                    >
                      {lab.test}
                    </Chip>
                  )
                )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-end gap-3 justify-between">
              <CustomComboBox
                label="Select Lab Test"
                size="sm"
                items={labs}
                isLoading={false}
                selectedKey={selectedLab}
                onSelectionChange={setSelectedLab}
              >
                {labs.map((lab: SelectItemInterface) => (
                  <AutocompleteItem key={lab.key}>
                    {lab.display_name}
                  </AutocompleteItem>
                ))}
              </CustomComboBox>

              <Button
                size="sm"
                className="font-nunito"
                isDisabled={
                  selectedLab === null ||
                  (selectedLab === "OTHER TESTS" && otherTest === "")
                }
                onPress={() => {
                  if (selectedLab === "OTHER TESTS") {
                    addOtherTestToSelected(otherTest);
                    setOtherTest("");
                  } else {
                    addToSelectedLabs(selectedLab);
                  }
                }}
              >
                Add
              </Button>
            </div>
            {/* other tests */}
            {selectedLab === "OTHER TESTS" && (
              <CustomInput
                label="Specify Other Tests"
                name="other-tests"
                value={otherTest}
                onValueChange={setOtherTest}
              />
            )}
            {/* selected labs */}
            <div className="flex flex-wrap gap-3">
              {selectedLabs.length > 0 &&
                selectedLabs.map((lab) => (
                  <Chip
                    variant="flat"
                    color="success"
                    className="font-nunito"
                    key={lab}
                    onClose={() => removeFromSelectedLabs(lab)}
                  >
                    {lab}
                  </Chip>
                ))}
            </div>

            {/* send request */}
            <Button
              onPress={() => confirmDisclosure.onOpen()}
              className="font-nunito"
              color="primary"
            >
              Send Request
            </Button>
          </div>
        )}
        {/* end:: lab tests */}

        {/* begin:: lab results */}
        {labDetails && (
          <div className="flex flex-col gap-5">
            <h3 className="font-montserrat text-slate-700 dark:text-slate-300 font-semibold text-lg">
              Lab Results
            </h3>
            <div className="flex flex-col gap-3">
              {labDetails.labTests.map(
                (lab: { test: string; result: string }) => (
                  <CustomInput
                    label={lab.test}
                    name={lab.test}
                    value={lab.result}
                    isDisabled={true}
                  />
                )
              )}
            </div>
          </div>
        )}
        {/* end:: lab results */}
      </div>

      <ConfirmModal
        isModalOpen={confirmDisclosure.isOpen}
        onCloseModal={confirmDisclosure.onClose}
        title="Confirm Send Lab Request"
        actionText="Send"
        intent="send-lab-request"
      >
        <p className="font-nunito text-slate-800 dark:text-white">
          Are you sure to send this request? This action is irreversible!
        </p>
        <CustomInput
          label="Lab Tests"
          hidden={true}
          name="labTests"
          value={JSON.stringify(selectedLabs)}
        />
      </ConfirmModal>
    </div>
  );
};

export default Vitals;

export const action: ActionFunction = async ({ request, params }) => {
  const { visit_id, visit_details } = params;

  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const visitController = new VisitController(request);

  const parsedLabs = JSON.parse(formValues.labTests as string);
  let labs = [];
  for (const lab of parsedLabs) {
    labs.push({ test: lab, result: "" });
  }

  const response = await visitController.addVisitLab({
    visitId: visit_id as string,
    visitSubId: visit_details as string,
    labTests: labs,
  });

  return response;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const { visit_id, visit_details } = params;

  const visitController = new VisitController(request);

  const labDetails = await visitController.getLabDetails({
    visitId: visit_id as string,
    visitRecordId: visit_details as string,
  });

  return {
    labDetails,
  };
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Lab Requests - Visits - Medical Requests | Adamus Med Treatment",
    },
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
