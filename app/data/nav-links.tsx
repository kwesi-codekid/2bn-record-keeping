import { AdminNavLinkInterface } from "~/utils/types";
import UsersGroup from "~/components/icons/UsersGroup";
import DashboardIcon from "~/components/icons/Dashboard";
import BookListIcon from "~/components/icons/BookList";
import BuildingIcon from "~/components/icons/Building";
import WalkingIcon from "~/components/icons/Walking";
import MicroscopeIcon from "~/components/icons/Microscope";

export const adminNavLinks: AdminNavLinkInterface[] = [
  {
    path: "/admin",
    icon: <DashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    path: "/admin/departments",
    icon: <BuildingIcon className="size-4" />,
    label: "Departments",
  },
  {
    path: "/admin/users",
    icon: <UsersGroup className="size-4" />,
    label: "Users",
  },
  {
    path: "/admin/medical-requests",
    icon: <BookListIcon className="size-4" />,
    label: "Medical Requests",
  },
  {
    path: "/admin/visits",
    icon: <WalkingIcon className="size-4" />,
    label: "Clinical Visits",
  },
  {
    path: "/admin/lab-requests",
    icon: <MicroscopeIcon className="size-4" />,
    label: "Laboratory Requests",
  },
];

export const managerNavLinks: AdminNavLinkInterface[] = [
  {
    path: "/manager",
    icon: <DashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    path: "/manager/medical-requests",
    icon: <BookListIcon className="size-4" />,
    label: "Medical Requests",
  },
];

export const staffNavLinks: AdminNavLinkInterface[] = [
  {
    path: "/staff",
    icon: <DashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    path: "/staff/medical-requests",
    icon: <BookListIcon className="size-4" />,
    label: "Medical Requests",
  },
];

export const doctorNavLinks: AdminNavLinkInterface[] = [
  {
    path: "/doctor",
    icon: <DashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    path: "/doctor/medical-requests",
    icon: <BookListIcon className="size-4" />,
    label: "Medical Requests",
  },
  {
    path: "/doctor/visits",
    icon: <WalkingIcon className="size-4" />,
    label: "Clinical Visits",
  },
];

export const nurseNavLinks: AdminNavLinkInterface[] = [
  {
    path: "/nurse",
    icon: <DashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    path: "/nurse/medical-requests",
    icon: <BookListIcon className="size-4" />,
    label: "Medical Requests",
  },
  {
    path: "/nurse/visits",
    icon: <WalkingIcon className="size-4" />,
    label: "Clinical Visits",
  },
];

export const technicianNavLinks: AdminNavLinkInterface[] = [
  {
    path: "/lab-technician",
    icon: <DashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    path: "/lab-technician/medical-requests",
    icon: <BookListIcon className="size-4" />,
    label: "Medical Requests",
  },
  {
    path: "/lab-technician/lab-requests",
    icon: <MicroscopeIcon className="size-4" />,
    label: "Laboratory Requests",
  },
];

export const visitDetailsTabs = [
  { path: "", label: "Vitals" },
  { path: "/consultation", label: "Consultation" },
  { path: "/labs", label: "Lab Request" },
  { path: "/referral-feedback", label: "Referral Feedback" },
];
