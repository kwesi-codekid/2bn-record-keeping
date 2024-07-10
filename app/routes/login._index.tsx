import { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

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
      id="login-form"
      method="POST"
      replace={true}
    >
      <CustomInput
        label="Phone Number"
        name="phone"
        isRequired={true}
        isInvalid={
          actionErrors &&
          actionErrors?.errors?.find((error) => error.field === "phone")
            ? true
            : false
        }
        errorMessage={
          actionErrors &&
          actionErrors?.errors?.find((error) => error.field === "phone")
            ?.message
        }
        onValueChange={() => setActionErrors(undefined)}
      />
      <Button
        variant="solid"
        color="primary"
        className="font-montserrat font-semibold text-lg"
        isLoading={
          navigation.state === "loading" || navigation.state === "submitting"
        }
        type="submit"
        form="login-form"
      >
        Send
      </Button>
    </Form>
  );
};

export default AdminLogin;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;

  const userController = new UserController(request);
  const response = await userController.loginUserWithPhone({ phone });

  return response;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Login | Adamus Med Treatment" },
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
