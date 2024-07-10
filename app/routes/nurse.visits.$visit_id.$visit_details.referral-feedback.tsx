import { Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import CustomInput from "~/components/ui/inputs/input";
import CustomTextarea from "~/components/ui/inputs/textarea";
import VisitController from "~/controllers/VisitController";
import { errorToast, successToast } from "~/utils/toasters";
import { VisitInterface, VitalInterface } from "~/utils/types";

const Vitals = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { visit_id, visit_details } = useParams();

  // loader data
  const { referralFeedback } = useLoaderData<{
    referralFeedback: any;
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
      navigate(`/nurse/visits/${visit_id}/${visit_details}/referral-feedback`, {
        replace: true,
      });
    }
  }, [actionData]);

  // 	• Referral diagnosis
  // 	• Referral treatment
  // Follow up plan

  return (
    <div className="h-full flex flex-col gap-4 md:gap-8 pt-3 bg-white dark:bg-slate-900/80 rounded-3xl px-4 md:px-5">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat font-semibold text-xl">
          Referral Feedback
        </h2>
      </div>

      <Form method="post" id="vitals-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div>
            <CustomTextarea
              label="Referral Diagnosis"
              name="diagnosis"
              defaultValue={referralFeedback?.diagnosis || ""}
            />
          </div>
          <div>
            <CustomTextarea
              label="Referral Treatment"
              name="treatment"
              defaultValue={referralFeedback?.treatment || ""}
            />
          </div>
          <div>
            <CustomTextarea
              label="Follow-Up Plan"
              name="followUpPlan"
              defaultValue={referralFeedback?.followUpPlan || ""}
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
            Save Details
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

  return await medRequestController.addVisitReferralFeedback({
    visitId: visit_id as string,
    visitSubId: visit_details as string,
    diagnosis: formValues.diagnosis as string,
    treatment: formValues.treatment as string,
    followUpPlan: formValues.followUpPlan as string,
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { visit_id } = params;

  const visitController = new VisitController(request);

  const referralFeedback = await visitController.getReferralFeedback(
    visit_id as string
  );
  return {
    referralFeedback,
  };
};

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Referral Feedback - Visits - Medical Requests | Adamus Med Treatment",
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
