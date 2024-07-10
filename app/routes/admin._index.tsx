import { LoaderFunction, MetaFunction } from "@remix-run/node";
import React from "react";
import UserController from "~/controllers/UserController";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";

const AdminDashboard = () => {
  return (
    <div>
      <Card className="max-w-[400px]">
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboard;

export const loader: LoaderFunction = async ({ request, params }) => {
  return {};
};

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Adamus Med Treatment" },
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
