import { Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutlet,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomInput from "~/components/ui/inputs/input";
import VisitController from "~/controllers/VisitController";
import { errorToast, successToast } from "~/utils/toasters";
import { VitalInterface } from "~/utils/types";

const Vitals = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { visit_id, visit_details } = useParams();

  const [vitalData, setVitalData] = useState<VitalInterface>();

  // function to fetch vitals
  const fetchVitals = async (visitId: string, visitRecordId: string) => {
    try {
      const response = await axios.get(
        `/api/get-vitals?visitId=${visitId}&visitRecordId=${visitRecordId}`
      );
      setVitalData(response.data.vitals);
    } catch (error) {
      console.log("Error fetching vitals", error);
    }
  };
  useEffect(() => {
    fetchVitals(visit_id as string, visit_details as string);
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
      successToast("Success!", actionData.message);
      navigate(`/doctor/visits/${visit_id}/${visit_details}`, {
        replace: true,
      });
    }
  }, [actionData]);

  return (
    <div className="h-full flex flex-col gap-4 md:gap-8 pt-3 bg-white dark:bg-slate-900/80 rounded-3xl px-4 md:px-5">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat font-semibold text-xl">Client Vitals</h2>
      </div>

      <Form method="post" id="vitals-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div>
            <CustomInput
              label="Height"
              name="height"
              type="number"
              endContent="cm"
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, height: value }));
              }}
              value={vitalData?.height}
            />
          </div>
          <div>
            <CustomInput
              label="Weight"
              name="weight"
              type="number"
              endContent="kg"
              value={vitalData?.weight}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, weight: value }));
              }}
            />
          </div>
          <div>
            <CustomInput
              label="Temperature"
              name="temperature"
              type="number"
              endContent="°C"
              value={vitalData?.temperature}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, temperature: value }));
              }}
            />
          </div>
          <div>
            <CustomInput
              label="Blood Pressure"
              name="bp"
              type="text"
              endContent="mmHg"
              value={vitalData?.bp}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, bp: value }));
              }}
            />
          </div>
          <div>
            <CustomInput
              label="Pulse"
              name="pulse"
              type="number"
              endContent="bpm"
              value={vitalData?.pulse}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, pulse: value }));
              }}
            />
          </div>
          <div>
            <CustomInput
              label="Respiratory Rate"
              name="respiration"
              type="number"
              endContent="sp02"
              value={vitalData?.respiration}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, respiration: value }));
              }}
            />
          </div>
          <div>
            <CustomInput
              label="BMI"
              name="bmi"
              type="number"
              endContent="%"
              value={vitalData?.bmi}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, bmi: value }));
              }}
            />
          </div>
          <div>
            <CustomInput
              label="Sp02"
              name="sp02"
              type="number"
              endContent="%"
              value={vitalData?.sp02}
              onValueChange={(value) => {
                setVitalData((prev) => ({ ...prev, sp02: value }));
              }}
            />
          </div>
        </div>

        <div className=" gap-4 mt-4">
          <Button
            color="success"
            type="submit"
            form="vitals-form"
            className="font-montserrat text-white font-medium bg-green-500"
            isLoading={navigation.state === "submitting"}
          >
            Save Vitals
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Vitals;

export const action: ActionFunction = async ({ request, params }) => {
  const { visit_id, visit_details } = params;

  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const medRequestController = new VisitController(request);

  return await medRequestController.addVisitVitals({
    visitId: visit_id as string,
    visitSubId: visit_details as string,
    temperature: formValues.temperature as string,
    pulse: formValues.pulse as string,
    respiration: formValues.respiration as string,
    sp02: formValues.sp02 as string,
    weight: formValues.weight as string,
    height: formValues.height as string,
    bmi: formValues.bmi as string,
    bp: formValues.bp as string,
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Vitals - Visits - Medical Requests | Adamus Med Treatment" },
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
