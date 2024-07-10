import { MetaFunction } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { UserInterface } from "~/utils/types";

const AdminDepartments = () => {
  const { user } = useOutletContext<{
    user: UserInterface;
  }>();

  return (
    <div className="h-full flex flex-col gap-2">
      <Outlet context={{ user }} />
    </div>
  );
};

export default AdminDepartments;

export const meta: MetaFunction = () => {
  return [
    { title: "Clinical Visits | Adamus Med Treatment" },
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
