import { Button } from "@nextui-org/react";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";
import VisitController from "~/controllers/VisitController";
import { visitDetailsTabs } from "~/data/nav-links";
import { VitalInterface } from "~/utils/types";

const AdminDepartments = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { visit_id, visit_details } = useParams();

  // loader data
  const { vital } = useLoaderData<{
    vital: VitalInterface;
  }>();

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {visitDetailsTabs.map((tab) => (
            <Button
              key={tab.label}
              variant={`${
                pathname ===
                "/nurse/visits/" + visit_id + "/" + visit_details + tab.path
                  ? "flat"
                  : "light"
              }`}
              color="primary"
              size="sm"
              className="font-nunito"
              onPress={() =>
                navigate(
                  `/nurse/visits/${visit_id}/${visit_details}${tab.path}`
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
          onPress={() => navigate(`/nurse/visits/${visit_id}`)}
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
    </div>
  );
};

export default AdminDepartments;

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
