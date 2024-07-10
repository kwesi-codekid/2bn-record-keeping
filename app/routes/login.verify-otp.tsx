import { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import { Button } from "@nextui-org/react";
import CustomInput from "~/components/ui/inputs/input";
import UserController from "~/controllers/UserController";
import { useEffect, useState } from "react";

const AdminLogin = () => {
  const navigation = useNavigation();

  const actionData = useActionData<{
    status: "error" | "success";
    message: string;
    errors: [{ field: string; message: string }];
  }>();

  const [actionErrors, setActionErrors] = useState<{
    status: "error" | "success";
    message: string;
    errors: [{ field: string; message: string }];
  }>();

  useEffect(() => {
    setActionErrors(actionData);
  }, [actionData]);

  return (
    <Form
      className="flex flex-col gap-8 w-full md:w-[80%]"
      id="verify-otp-form"
      method="POST"
      replace={true}
    >
      <CustomInput
        label="OTP Code"
        name="otp"
        isRequired={true}
        isInvalid={
          actionErrors &&
          actionErrors?.errors?.find((error) => error.field === "otp")
            ? true
            : false
        }
        errorMessage={
          actionErrors &&
          actionErrors?.errors?.find((error) => error.field === "otp")?.message
        }
        onValueChange={() => setActionErrors(undefined)}
      />
      {actionErrors?.status === "error" && (
        <p className="text-slate-600 dark:text-slate-100 text-sm">
          <Link
            to={"/login"}
            className="text-blue-600 hover:text-blue-500 transition-all duration-400"
          >
            Click here{" "}
          </Link>
          to change your phone number
        </p>
      )}
      <Button
        variant="solid"
        color="primary"
        className="font-montserrat font-semibold text-lg"
        isLoading={
          navigation.state === "loading" || navigation.state === "submitting"
        }
        type="submit"
        form="verify-otp-form"
      >
        Verify OTP
      </Button>
    </Form>
  );
};

export default AdminLogin;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const otp = formData.get("otp") as string;

  const userController = new UserController(request);
  return await userController.verifyOTP({ otp });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Verify OTP | Adamus Med Treatment" },
    {
      name: "description",
      content: ".",
    },
    {
      name: "author",
      content: "KwaminaWhyte",
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
