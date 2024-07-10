import { LoaderFunction } from "@remix-run/node";
import VisitController from "~/controllers/VisitController";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const visitId = url.searchParams.get("visitId") as string;
  const visitRecordId = url.searchParams.get("visitRecordId") as string;

  const visitController = new VisitController(request);

  const vitals = await visitController.getVitalDetails({
    visitId: visitId as string,
    visitRecordId: visitRecordId as string,
  });

  return {
    vitals,
  };
};
