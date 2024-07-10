import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigation,
  Outlet,
  useLoaderData,
  NavLink,
} from "@remix-run/react";
import { useTheme } from "next-themes";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { managerNavLinks } from "~/data/nav-links";
import { AdminNavLinkInterface, UserInterface } from "~/utils/types";
import { SunIcon } from "~/components/icons/Sun";
import { MoonIcon } from "~/components/icons/Moon";
import ConfirmLogoutModal from "~/components/modals/ConfirmLogout";
import logo from "~/assets/images/logo.png";

import { LoaderFunction, redirect } from "@remix-run/node";
import UserController from "~/controllers/UserController";
import NavHeader from "~/components/ui/nav-header";

const ManagerLayout = () => {
  // loader data
  const { user } = useLoaderData<{ user: UserInterface }>();

  // theme
  const { theme, setTheme } = useTheme();

  // location
  const navigation = useNavigation();
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // logout modal
  const logoutDisclosure = useDisclosure();

  // handle click outside to hide mobile nav
  const mobileNavRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(e.target as Node)
      ) {
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className={`md:h-screen flex gap-4 bg-slate-400/20 dark:bg-slate-950`}
    >
      {/* mobile nav */}
      <aside
        ref={mobileNavRef}
        className={`h-full fixed top-0 left-0 z-50 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-r-3xl overflow-hidden shadow-2xl ${
          isMobileExpanded ? "w-56" : "w-0"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="px-2 py-3">
          <div className="bg-blue-600 rounded-2xl px-4 py-3 flex flex-col gap-2 shadow-2xl shadow-blue-800/30 mb-10">
            <img src={logo} alt="logo" className="size-8" />

            {isDesktopExpanded && (
              <h3 className="font-montserrat font-bold text-white text-lg">
                Med Treatment
              </h3>
            )}
          </div>
        </div>

        {/* nav links */}
        <div className="flex flex-col gap-2 p-2">
          {managerNavLinks.map((link: AdminNavLinkInterface, index: number) => {
            return (
              <NavLink
                key={index}
                to={link.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 text-white hover:text-blue-300 transition-all duration-300 font-nunito text-sm rounded-xl ${
                    isActive ? "bg-indigo-500" : ""
                  }`
                }
              >
                {link.icon}
                <span
                  className={`${isDesktopExpanded ? "inline-block" : "hidden"}`}
                >
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </aside>

      {/* desktop nav  */}
      <aside
        className={`h-full relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden ${
          isDesktopExpanded ? "w-[17%] px-4 py-3" : "w-16 p-2"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col gap-10">
          <div
            className={`bg-blue-600 items-center rounded-2xl flex flex-col shadow-2xl shadow-blue-800/30 ${
              !isDesktopExpanded
                ? "items-center justify-center p-2"
                : " px-3 py-2"
            }`}
          >
            <img
              src={logo}
              alt="logo"
              className={`${isDesktopExpanded ? "w-[70%]" : "w-8"}`}
            />

            {isDesktopExpanded && (
              <h3 className="font-montserrat font-bold text-white text-xl">
                Med Treatment
              </h3>
            )}
          </div>

          <div className="flex flex-col gap-1 p-2">
            {managerNavLinks.map(
              (link: AdminNavLinkInterface, index: number) => {
                return (
                  <NavLink
                    end
                    key={index}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 text-white hover:text-blue-300 transition-all duration-300 font-nunito text-sm rounded-xl ${
                        isActive ? "bg-indigo-500" : ""
                      }`
                    }
                  >
                    {link.icon}
                    <span
                      className={`${
                        isDesktopExpanded ? "inline-block" : "hidden"
                      }`}
                    >
                      {link.label}
                    </span>
                  </NavLink>
                );
              }
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 h-full flex flex-col gap-4 py-2 px-1 md:pr-4 pt-1">
        <div className="flex flex-col gap-2">
          <Progress
            size="sm"
            isIndeterminate={navigation.state === "loading"}
            aria-label="Loading..."
            className="w-full"
          />
          <header className="bg-indigo-600 flex items-center justify-between py-1 px-4 md:pl-2 rounded-2xl">
            <div className="flex items-center gap-3 ">
              {isDesktopExpanded ? (
                <Button
                  isIconOnly
                  variant="light"
                  className="text-white hidden lg:flex items-center justify-center"
                  onClick={() => setIsDesktopExpanded(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
                  </svg>
                </Button>
              ) : (
                <Button
                  isIconOnly
                  variant="light"
                  className="text-white hidden lg:flex items-center justify-center"
                  onClick={() => setIsDesktopExpanded(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="M20.9997 4H6.99967V6H20.9997V4ZM20.9997 11H10.9997V13H20.9997V11ZM20.9997 18H6.99967V20H20.9997V18ZM1.98926 8.81412L3.40347 7.3999L7.99967 11.9961L3.40347 16.5923L1.98926 15.1781L5.17124 11.9961L1.98926 8.81412Z"></path>
                  </svg>
                </Button>
              )}
              <NavHeader navLinks={managerNavLinks} basePath="/manager" />
            </div>

            <div className="flex items-center md:gap-3">
              {/* theme switcher */}
              <Button
                isIconOnly
                radius="full"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white !bg-transparent mr-1"
              >
                {theme === "dark" ? (
                  <SunIcon className="size-8" />
                ) : (
                  <MoonIcon className="size-8" />
                )}
              </Button>

              {/* dropdown */}
              <Dropdown placement="bottom-start" size="sm">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      className: "!bg-white",
                      fallback: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 32 32"
                          className="text-indigo-600 size-8"
                        >
                          <path
                            fill="none"
                            d="M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0M20.5 12.5A4.5 4.5 0 1 1 16 8a4.5 4.5 0 0 1 4.5 4.5"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M26.749 24.93A13.99 13.99 0 1 0 2 16a13.9 13.9 0 0 0 3.251 8.93l-.02.017c.07.084.15.156.222.239c.09.103.187.2.28.3q.418.457.87.87q.14.124.28.242q.48.415.99.782c.044.03.084.069.128.1v-.012a13.9 13.9 0 0 0 16 0v.012c.044-.031.083-.07.128-.1q.51-.368.99-.782q.14-.119.28-.242q.451-.413.87-.87c.093-.1.189-.197.28-.3c.071-.083.152-.155.222-.24ZM16 8a4.5 4.5 0 1 1-4.5 4.5A4.5 4.5 0 0 1 16 8M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0"
                          ></path>
                        </svg>
                      ),
                      size: "sm",
                    }}
                    className="transition-transform"
                    description={
                      <p className="hidden md:block text-slate-200 font-nunito">
                        {user?.email}
                      </p>
                    }
                    name={
                      <p className="hidden md:block font-nunito font-semibold text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                    }
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold font-montserrat">Signed in as</p>
                    <p className="font-bold font-nunito capitalize">
                      @{user?.role}
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    variant="flat"
                    onClick={() => logoutDisclosure.onOpen()}
                    className=""
                  >
                    <div className="flex items-center gap-2 text-red-500 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        className="size-4"
                      >
                        <path
                          fill="currentColor"
                          d="M11 12V4q0-.425.288-.712T12 3t.713.288T13 4v8q0 .425-.288.713T12 13t-.712-.288T11 12m1 9q-1.85 0-3.488-.712T5.65 18.35t-1.937-2.863T3 12q0-1.725.638-3.312T5.425 5.85q.275-.3.7-.3t.725.3q.275.275.25.688t-.3.737q-.85.95-1.325 2.163T5 12q0 2.9 2.05 4.95T12 19q2.925 0 4.963-2.05T19 12q0-1.35-.475-2.588t-1.35-2.187q-.275-.3-.288-.7t.263-.675q.3-.3.725-.3t.7.3q1.175 1.25 1.8 2.838T21 12q0 1.85-.712 3.488t-1.925 2.862t-2.85 1.938T12 21"
                        ></path>
                      </svg>
                      Log Out
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* mobile nav toggler */}
              {isMobileExpanded ? (
                <Button
                  isIconOnly
                  variant="light"
                  className="text-white lg:hidden block"
                  onClick={() => setIsMobileExpanded(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
                  </svg>
                </Button>
              ) : (
                <Button
                  isIconOnly
                  variant="light"
                  className="text-white lg:hidden flex items-center justify-center "
                  onClick={() => setIsMobileExpanded(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path d="M20.9997 4H6.99967V6H20.9997V4ZM20.9997 11H10.9997V13H20.9997V11ZM20.9997 18H6.99967V20H20.9997V18ZM1.98926 8.81412L3.40347 7.3999L7.99967 11.9961L3.40347 16.5923L1.98926 15.1781L5.17124 11.9961L1.98926 8.81412Z"></path>
                  </svg>
                </Button>
              )}
            </div>
          </header>
        </div>
        {/* )} */}

        <main className="flex-1 rounded-2xl">
          <Outlet context={{ user }} />
        </main>
      </section>

      <ConfirmLogoutModal
        isModalOpen={logoutDisclosure.isOpen}
        onCloseModal={logoutDisclosure.onClose}
      />
    </section>
  );
};

export default ManagerLayout;

export const loader: LoaderFunction = async ({ request }) => {
  const userController = new UserController(request);
  const user = await userController.getUser();
  await userController.checkUserRole("manager");

  if (!user) {
    return redirect("/login");
  }

  return { user };
};
