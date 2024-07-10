import { useLocation } from "@remix-run/react";
import { ReactNode } from "react";

const NavHeader = ({
  navLinks,
  basePath,
}: {
  navLinks: { label: string; path: string; icon: ReactNode }[];
  basePath?:
    | "/admin"
    | "/staff"
    | "/doctor"
    | "/nurse"
    | "/manager"
    | "/lab-technician"
    | "/supervisor";
}) => {
  const { pathname } = useLocation();

  // Trim leading slash for comparison
  const trimmedPathname = pathname.startsWith(basePath as string)
    ? pathname.slice(1)
    : pathname;

  // Find the active link
  const activeLink = navLinks.find((link) => {
    const trimmedLinkPath = link.path.startsWith(basePath as string)
      ? link.path.slice(1)
      : link.path;
    return (
      (link.path === (basePath as string) &&
        pathname === (basePath as string)) ||
      (link.path !== (basePath as string) &&
        trimmedPathname.startsWith(trimmedLinkPath))
    );
  });

  return (
    <h3 className="font-montserrat font-semibold md:font-bold text-white text-lg md:text-xl">
      {activeLink?.label}
    </h3>
  );
};

export default NavHeader;
