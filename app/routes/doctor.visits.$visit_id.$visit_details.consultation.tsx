import {
  Button,
  Checkbox,
  Chip,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import CustomDatePicker from "~/components/ui/inputs/datepicker";
import CustomInput from "~/components/ui/inputs/input";
import CustomSelect from "~/components/ui/inputs/select";
import CustomTextarea from "~/components/ui/inputs/textarea";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import VisitController from "~/controllers/VisitController";
import { diagnosis, workStatus } from "~/data/select-items";
import { getValuesFromSet } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import {
  ConsultationInterface,
  VisitInterface,
  VitalInterface,
} from "~/utils/types";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

const ConsultationForm = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { visit_id, visit_details } = useParams();

  // loader data
  const { visit, consultation } = useLoaderData<{
    visit: VisitInterface;
    consultation: ConsultationInterface;
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
      navigate(`/doctor/visits/${visit_id}/${visit_details}/consultation`, {
        replace: true,
      });
    }
  }, [actionData]);

  const [content, setContent] = useState(consultation?.notes || "");
  const [detained, setDetained] = useState(consultation?.detained || false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(
    consultation?.diagnosis || []
  );
  const [selectedWorkStatus, setSelectedWorkStatus] = useState(
    consultation?.workStatus || []
  );

  return (
    <div className="h-full md:h-[82vh] flex flex-col gap-4 md:gap-8 pt-3 bg-white dark:bg-slate-900/80 rounded-3xl px-4 md:px-5 overflow-y-auto vertical-scrollbar pb-5">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat font-semibold text-xl">
          Client Consultation
        </h2>
      </div>
      {/* 
	• Referred to 
	• Review date
Detained
      */}

      <Form method="post" id="consultation-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <CustomTextarea
            label="Consultation"
            name="consultation"
            defaultValue={consultation?.consultation}
          />
          <CustomTextarea
            label="Complaints"
            name="complaints"
            defaultValue={consultation?.complaints}
          />
          <CustomTextarea
            label="Investigation"
            name="investigation"
            defaultValue={consultation?.investigation}
          />
          <CustomTextarea
            label="Disposition"
            name="disposition"
            defaultValue={consultation?.disposition}
          />
          <CustomTextarea
            label="Treatment"
            name="treatment"
            defaultValue={consultation?.treatment}
          />
          <div className="flex flex-col gap-2">
            <h4 className="text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100">
              Diagnosis
            </h4>
            <CustomInput
              label="Diagnosis"
              name="diagnosis"
              hidden={true}
              value={getValuesFromSet(selectedDiagnosis)}
            />
            <CustomSelect
              label=""
              name="selectedDiagnosis"
              options={diagnosis}
              multiple={true}
              isMultiline={true}
              description="Select all that apply"
              renderValue={(items) => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item: any) => (
                      <Chip variant="flat" key={item.key}>
                        {item.textValue}
                      </Chip>
                    ))}
                  </div>
                );
              }}
              selectedKeys={selectedDiagnosis}
              onSelectionChange={setSelectedDiagnosis}
            />
          </div>
          <CustomSelect
            label="Work Status"
            name="work_status"
            options={workStatus}
            defaultSelectedKeys={selectedWorkStatus}
            renderValue={(items) => {
              return (
                <div className="flex flex-wrap gap-2">
                  {items.map((item: any) => (
                    <Chip
                      variant="flat"
                      key={item.key}
                      color={`${
                        item.key === "fit-to-work"
                          ? "success"
                          : item.key === "light-duty"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {item.textValue}
                    </Chip>
                  ))}
                </div>
              );
            }}
          />
          <CustomInput
            label="Excuse Duty Duration"
            name="excuseDutyDuration"
            endContent="days"
            type="number"
            defaultValue={consultation?.excuseDutyDuration.toString()}
          />
          <CustomDatePicker
            label="Review Date"
            name="reviewDate"
            // defaultValue={consultation?.reviewDate}
          />
          <CustomInput
            label="Referred To"
            name="referredTo"
            defaultValue={consultation?.referredTo}
          />
          <Checkbox
            name="detained"
            className="text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100"
            isSelected={detained}
            onValueChange={setDetained}
            value={detained ? "true" : "false"}
          >
            Detained
          </Checkbox>
          <div>
            <span></span>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100">
              Additional Notes
            </h4>
            <Input name="notes" value={content} className="hidden" />
            <ReactQuill
              value={content}
              onChange={setContent}
              className="md:!h-[52vh] h-[45vh] mb-12 !font-nunito"
            />
          </div>
        </div>

        <div className=" gap-4 mt-4">
          <Button
            color="success"
            type="submit"
            form="consultation-form"
            className="font-montserrat text-white font-medium bg-green-500"
            isLoading={navigation.state === "submitting"}
          >
            Complete Consultation
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ConsultationForm;

export const action: ActionFunction = async ({ request, params }) => {
  const { visit_id, visit_details } = params;

  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const visitController = new VisitController(request);
  const response = await visitController.addVisitConsultation({
    visitId: visit_id as string,
    visitSubId: visit_details as string,
    consultation: formValues.consultation as string,
    complaints: formValues.complaints as string,
    investigation: formValues.investigation as string,
    disposition: formValues.disposition as string,
    treatment: formValues.treatment as string,
    diagnosis: formValues.diagnosis as string,
    work_status: formValues.work_status as string,
    excuseDutyDuration: formValues.excuseDutyDuration as string,
    reviewDate: formValues.reviewDate as string,
    referredTo: formValues.referredTo as string,
    detained: (formValues.detained as string) === "true" ? true : false,
    notes: formValues.notes as string,
  });

  return response;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { visit_id, visit_details } = params;

  const visitController = new VisitController(request);

  const visit = await visitController.getVisitById(visit_id as string);
  const consultation = await visitController.getConsultsationDetails({
    visitId: visit_id as string,
    visitRecordId: visit_details as string,
  });

  return {
    visit,
    consultation,
  };
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Consultation - Visits - Medical Requests | Adamus Med Treatment",
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
