import {
  Outlet,
  useActionData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useEffect } from "react";
import { errorToast, successToast } from "~/utils/toasters";
import { UserInterface } from "~/utils/types";

const NurseLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext<{
    user: UserInterface;
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
      navigate(location.pathname, { replace: true });
    }
  }, [actionData]);

  return (
    <div className="h-full flex flex-col gap-2">
      <Outlet context={{ user }} />
    </div>
  );
};

export default NurseLayout;
