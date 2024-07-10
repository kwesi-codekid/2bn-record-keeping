import { Button, Input } from "@nextui-org/react";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { color } from "framer-motion";
import { useState } from "react";

const LabRequestsLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const nav_links = [
    {
      label: "Pending",
      path: "/lab-technician/lab-requests",
      color: "primary",
    },
    {
      label: "Completed",
      path: "/lab-technician/lab-requests/completed",
      color: "success",
    },
  ];
  const [searchText, setSearchText] = useState("");
  return (
    <div className="h-[88vh] overflow-y-auto vertical-scrollbar flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {nav_links.map((link) => (
            <Button
              key={link.label}
              className="font-nunito"
              size="sm"
              variant={link.path === pathname ? "flat" : "light"}
              color={link.color as any}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </Button>
          ))}
        </div>
        <Input
          name="search"
          placeholder="Search here..."
          radius="md"
          classNames={{
            inputWrapper: "dark:bg-slate-800 bg-white h-9",
            input: "font-nunito text-sm",
          }}
          size="sm"
          label=""
          className="w-1/2 md:w-1/5"
          value={searchText}
          onValueChange={(value) => setSearchText(value)}
        />
      </div>

      {/* requests table */}
      <Outlet context={{ searchText }} />
    </div>
  );
};
export default LabRequestsLayout;
