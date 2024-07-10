import { AdminNavLinkInterface } from "~/utils/types";
import UsersGroup from "~/components/icons/UsersGroup";
import DashboardIcon from "~/components/icons/Dashboard";
import BookListIcon from "~/components/icons/BookList";
import BuildingIcon from "~/components/icons/Building";
import WalkingIcon from "~/components/icons/Walking";
import MicroscopeIcon from "~/components/icons/Microscope";
import { UserAnimated } from "~/components/icons/UserIcons";
import { LoginAnimatedIcon } from "~/components/icons/OpenIcons";
import { UserBadgeIcon } from "~/components/icons/UserIcons";

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
    path: "/admin/companies",
    icon: <UsersGroup className="size-4" />,
    label: "Companies",
  },
  {
    path: "/admin/staff",
    icon: <UserAnimated className="size-4" />,
    label: "Staff Management",
  },
  {
    path: "/admin/peace-keepings",
    icon: <BookListIcon className="size-4" />,
    label: "Peace-Keeping Missions",
  },
  {
    path: "/admin/promotions",
    icon: <UserBadgeIcon className="size-4" />,
    label: "Promotions",
  },
  {
    path: "/admin/transfers",
    icon: <LoginAnimatedIcon className="size-4" />,
    label: "Transfers",
  },
  {
    path: "/admin/other-duties",
    icon: <WalkingIcon className="size-4" />,
    label: "Other Duties",
  },
  {
    path: "/admin/reports",
    icon: <MicroscopeIcon className="size-4" />,
    label: "Reports",
  },
];
