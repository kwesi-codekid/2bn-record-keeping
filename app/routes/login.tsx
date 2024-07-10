import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import axios from "axios";
import {
  Form,
  Outlet,
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import { Button, Checkbox, Input } from "@nextui-org/react";
import { ArrowLeftIcon } from "~/components/icons/ArrowLeft";
import CustomInput from "~/components/ui/inputs/input";
import UserController from "~/controllers/UserController";
import medicare from "~/assets/illustrations/medicare.svg";

import logo from "~/assets/images/logo.png";
import logoBlackText from "~/assets/images/logo-black-text.png";
import { useTheme } from "next-themes";

const AdminLogin = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();

  const { theme } = useTheme();

  const actionData = useActionData<{
    status: "error" | "success";
    message: string;
    errors: [{ field: string; message: string }];
  }>();

  return (
    <div className="flex gap-4 h-screen">
      {/* login form */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full md:w-1/2 h-full flex flex-col justify-between py-3 px-4">
          <div>
            <img src={logoBlackText} alt="logo" className="w-52" />
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-1">
              <h3 className="font-montserrat font-bold text-3xl md:text-5xl text-slate-800 dark:text-white">
                Sign In
              </h3>
              <p className="font-nunito text-xs md:text-base text-slate-400 dark:text-slate-200">
                Login to your dashboard
              </p>
            </div>

            <Outlet />
          </div>

          <p className="text-sm font-montserrat text-slate-400">
            &copy; {new Date().getFullYear()} Adamus IT | All Rights Reserved
          </p>
        </div>
      </div>

      {/* illustration */}
      <div className="hidden md:flex-1 flex-col gap-4 items-center justify-center md:flex bg-slate-400/5 h-full rounded-bl-[12rem]">
        <img
          src={medicare}
          alt="medicare illustration"
          className="w-2/3 animate-bounce-slow"
        />
        <h1 className="font-montserrat font-extrabold text-5xl text-blue-600 text-center">
          Med Treatment App
        </h1>
      </div>
    </div>
  );
};

export default AdminLogin;

export const loader: LoaderFunction = async ({ request }) => {
  const adminController = await new UserController(request);
  const user = await adminController.checkUser();

  return (await adminController.getUserId()) ? redirect(`/${user?.role}`) : {};
};
