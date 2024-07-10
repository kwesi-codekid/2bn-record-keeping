import { Spinner } from "@nextui-org/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { Fade } from "react-awesome-reveal";

import logo from "~/assets/images/Army-logo.png";
import UserController from "~/controllers/UserController";

export default function SplashScreen() {
  const navigate = useNavigate();
  const { user } = useLoaderData<typeof loader>();

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        navigate(`/${user?.role}`);
      }
    }, 2800);
  }, []);

  return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
      <Fade direction="up" duration={600} cascade>
        <img src={logo} alt="company logo" className="w-[20rem]" />
        <h1 className="text-3xl md:text-5xl text-white text-center font-montserrat font-extrabold mb-6 mt-6">
          2BN Record-Keeping
        </h1>
        <Spinner size="lg" />
      </Fade>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const userController = new UserController(request);
  const user = await userController.getUser();

  return { user };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Adamus Med Treatment" },
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
