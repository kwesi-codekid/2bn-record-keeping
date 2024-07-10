import { MetaFunction } from "@remix-run/node";
import illustration from "~/assets/illustrations/medical-record.svg";

const AdminDepartments = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <img src={illustration} alt="illustration" className="w-1/2" />

      <p className="text-center text-slate-800 dark:text-white text-lg font-nunito">
        Select a clinical visit to view and manage details
      </p>
    </div>
  );
};

export default AdminDepartments;

export const meta: MetaFunction = () => {
  return [
    { title: "Medical Requests | Adamus Med Treatment" },
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
